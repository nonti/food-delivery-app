import {createClient} from 'redis';
import { getEnvironmentVariables } from '../environments/environment';

export const client = createClient({
  // url: 'redis://' + getEnvironmentVariables().redis.host + ':' + getEnvironmentVariables().redis.port,
  username: getEnvironmentVariables().redis.username,
  password: getEnvironmentVariables().redis.password,
  socket: {
    host: getEnvironmentVariables().redis.host,
    port: getEnvironmentVariables().redis.port,
  },
});

export class Redis {
 
  static connectToRedis() {
    // this.client.on("error", (err) => console.log("Redis Client Error: ", err));
     client.connect().then(() => {
    console.log('Connected to Redis');
     
     })
     .catch(e => {
        throw(e)
      });
  }

  static async setValue(key: string, value, expires_at?) {
    let options: any;
    if (expires_at) {
      options = {
        EX: expires_at,
      };
    }
    await client.set(key, value, options);
  }

  static async getValue(key: string) {
    const value = await client.get(key);
    return value;
  }

  static async deleteKey(key: string) {
    await client.del(key)
  }
}