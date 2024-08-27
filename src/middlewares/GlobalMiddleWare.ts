import { validationResult } from "express-validator";
import { Jwt } from "../utils/Jwt";

export class GlobalMiddleWare {
    static checkError (req, res, next) {
			const errors = validationResult(req);  // Get validation result from express-validator
        if(!errors.isEmpty()){
			next(new Error( errors.array()[0].msg));
		}else {
			next();
		}
  }

	static async auth (req, res, next){
		const header_auth = req.headers.authorization;
		const token = header_auth ?  header_auth.slice(7, header_auth.length) : null;
		// const auth_header = header_auth.split(' ');  const token1 = auth_header[1]; 
		try {
			if(!token) {
				req.errorStatus = 401;
				next(new Error('User does not exist'));
			}
			const decoded = await Jwt.jwtVerify(token);
			req.user = decoded;
			next();
		} catch (e) {
			req.errorStatus = 401;
			// next(e);
			next(new Error('User does not exist'));
		}
	}

	static adminRole (req, res, next){
		const user = req.user;
			if(user.type !== 'admin'){ 
				// req.errorStatus = 401;
				next(new Error('Unauthorized user '));
			}			
			next();
		}
}