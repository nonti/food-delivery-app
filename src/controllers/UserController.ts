import User from "../models/User";
import { Jwt } from '../utils/Jwt';
import { Utils } from "../utils/Utils";
import  {NodeMailer} from "../utils/NodeMailer";
export class UserController {
  static async signup(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const type = req.body.type;
    const status = req.body.status;
    const verification_token = Utils.generateVerificationToken();

    try {
      const hash = await Utils.encryptPassword(password);
      const data = {
        email,
        verification_token,
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        name,
        password: hash,
        phone,
        type,
        status,
      };

      const user = await new User(data).save();
      const payload = {
        // user_id: user.id,
        aud: user._id,
        email: user.email,
        type: user.type
      };
      const token = Jwt.jwtSign(payload);
      // SEND email to user for verification
      res.json({
        token: token,
        user: user
      });
      await NodeMailer.sendMail({
        to: [user.email],
        subject: "Email verification",
        html: `<h1>Your OTP is ${verification_token}</h1>`,
      });
    } catch (e) {
      next(e);
    }
  }

  static async verifyUserEmailToken(req, res, next) {
    const verification_token = req.body.verification_token;
    const email = req.user.email;
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: { $gt: Date.now() },
        },
        {
          email_verified: true,
          updated_at: new Date()
        },
        {
          new: true,
        }
      );
      if (user) {
        res.send(user);
      } else {
        // throw new Error('Wronng OTP or Email verification token expired. Please regenerate a new token');
        throw "Wronng OTP or Email verification token expired. Please regenerate a new token";
      }
    } catch (e) {
      next(e);
    }
  }

  static async resendVerificationEmail(req, res, next) {
    const email = req.user.email;
    const verification_token = Utils.generateVerificationToken();
    try {
      const user: any = await User.findOneAndUpdate(
        { email: email },
        {
          updated_at: new Date(),
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: "Resend Email Verification",
          html: `<h1>Your Otp is ${verification_token}</h1>`,
        });
      } else {
        throw new Error("User does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async signin(req,res, next){
    const user = req.user;
    const password = req.query.password;
    const data = {
      password,
      encrypt_password: user.password
    };
    try {
      //compares the password against encrypted password
      await Utils.comparePassword(data);
      const payload = {
        // user_id: user._id,
        aud: user._id,
        email: user.email,
        type: user.type
      };
      const token = Jwt.jwtSign(payload);
      res.json({
        token: token,
        user: user
      });
    } catch (e) {
      next(e);
    }
  }

  static async sendResetPasswordOtp(req,res, next){
    const email = req.query.email;
    const reset_password_token = Utils.generateVerificationToken();
    try {
      const user: any = await User.findOneAndUpdate(
        { email: email },
        {
          updated_at: new Date(),
          reset_password_token: reset_password_token,
          reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: "Reset password email verification OTP",
          html: `<h1>Your Otp is ${reset_password_token}</h1>`,
        });
      } else {
        throw new Error("User does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static verifyResetPasswordToken(req, res, next) {
    res.json({success: true})
  }

  static async resetPassword(req, res, next){
      const user = req.user;
      const new_password = req.body.new_password;
    try {
      const encrypted_password = await Utils.encryptPassword(new_password);
      const updated_user = await User.findByIdAndUpdate(
        user._id,
        {
          updated_at: new Date(),
          password: encrypted_password,
        },
        {new:true}
      );
      if (updated_user) {
        res.send(updated_user);
      } else {
        throw new Error("User does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async profile(req, res, next){
    const user = req.user;
    try {
      const profile = await User.findById(user.aud);
      if (profile) {
        res.send(profile);
      } else {
        throw new Error("User does not exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async updatePhoneNumber(req, res, next){
    const user = req.user;
    const phone = req.body.phone;
    try {
      const user_data = await User.findByIdAndUpdate(
        user.aud,
        {phone: phone, updated_at: new Date()},
        {new: true}
      );
      res.send(user_data);
    } catch (e) {
      next(e);
    }
  }

  static async updateUserProfile(req, res, next){
    const user = req.user;
    const phone = req.body.phone;
    const new_email = req.body.email;
    const plain_password = req.body.password;
    const verification_token = Utils.generateVerificationToken();
    
    try {
      const user_data = await User.findById(user.aud);
      if(!user_data) throw new Error('User does not exist');
      await Utils.comparePassword({
        password: plain_password,
        encrypt_password: user_data.password
      });
      const updated_user = await User.findByIdAndUpdate(
        user.aud,
        {
          phone: phone,
          email: new_email,
          email_verified: false,
          verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
          updated_at: new Date()
        },
        {new: true}
      );
      const payload = {
        // user_id: user.id,
        aud: user.aud,
        email: updated_user.email,
        type: updated_user.type
      };
      const token = Jwt.jwtSign(payload);
      res.json({
        token: token,
        user: updated_user
      });
      // send email to user for updated email verification
      await NodeMailer.sendMail({
        to: [updated_user.email],
        subject: "Email verification",
        html: `<h1>Your OTP is ${verification_token}</h1>`,
      });
    } catch (e) {
      next(e);
    }
  }
}
