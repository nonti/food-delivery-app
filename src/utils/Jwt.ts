import { getEnvironmentVariables } from '../environments/environment';
import * as jwt from 'jsonwebtoken';
import * as Crypto from 'crypto';
import { Redis } from './Redis';
export class Jwt {
  static jwtSign(payload, userId, expires_in: string = '1h') {
    // Jwt.gen_secret_key()
    return jwt.sign(payload, getEnvironmentVariables().jwt_secret_key, {
      expiresIn: expires_in,
      audience: userId.toString(),
      issuer: 'nonty',
    });
  }

  static jwtVerify(token): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getEnvironmentVariables().jwt_secret_key, (err, decoded) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error('User is no authrised'));
          else resolve(decoded);
        }
      );
    });
  }

  static async jwtSignRefreshToken(
    payload, 
    userId, 
    expires_in: string = '1y', 
    redis_ex: number = 365 * 24 * 60 * 60 
    // redis_ex: number = 20 

  ) {
    try {
      const refresh_token =  jwt.sign(
        payload, 
        getEnvironmentVariables().jwt_refresh_secret_key, 
      {
        expiresIn: expires_in,
        audience: userId.toString(),
        issuer: 'nonty',
      });
      //set refresh token in Redis with userid
      Redis.setValue(userId.toString(),refresh_token, redis_ex);
      return refresh_token;
    } catch (e) {
      // throw new Error(e);
      throw(e);
    }
    
  }

  static jwtVerifyRefreshToken(refresh_token): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(refresh_token,getEnvironmentVariables().jwt_refresh_secret_key, (err, decoded) => {
          if (err) reject(err);
          else if (!decoded) reject(new Error('User is not authorised'));
          else {
          //match refresh tokens from redis database
          const user: any = decoded;
            Redis.getValue(decoded.aud).then(value => {
              if(value === refresh_token) resolve(decoded);
              else reject(new Error('Your session is expired! Please signin again.'));
            })
            .catch(e => {
              reject(e)
            }) 
            resolve(decoded);
          }
        }
      );
    });
  }

  private static gen_secret_key() {
    const DEV_access_token_secret_key = Crypto.randomBytes(32).toString('hex');
    const DEV_refresh_token_secret_key = Crypto.randomBytes(32).toString('hex');

    const PROD_access_token_secret_key = Crypto.randomBytes(32).toString('hex');
    const PROD_refresh_token_secret_key = Crypto.randomBytes(32).toString('hex');

    console.table({
      DEV_access_token_secret_key,
      DEV_refresh_token_secret_key,
      PROD_access_token_secret_key,
      PROD_refresh_token_secret_key,
    });
  }
}
