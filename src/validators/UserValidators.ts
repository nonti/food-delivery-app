import { body, query } from 'express-validator';
import User from '../models/User';

export class UserValidators {
  static signup() {
    return [
        body('name', 'Name is required').isString(),
        body('email', 'Email is required').isEmail()
          .custom((email, { req }) => {
            return User.findOne({
              email: email
            }).then(user => {
              if (user) {
                // throw new Error('User Already Exists');
                throw ('User Already Exists');
              } else {
                return true;
              }
            }).catch(err => {
              throw new Error(err);
            })
          }),
        body('password', 'Password is required').isAlphanumeric()
          .isLength({ min: 8, max: 20 })
          .withMessage('Password must be between 8  and 20 characters'),
        body('type', 'User role type is required').isString(),
        body('status', 'User status is required').isString(),
        body('phone', 'Phone number is required').isString(),
      ];
  }

  static verifyUserEmailToken() {
    return [
      body('verification_token', 'Verification token is required').isNumeric(),
    ];
  }

  static signin() {
    return [
        query('email', 'Email is required').isEmail()
          .custom((email, { req }) => {
            return User.findOne({
              email: email
            }).then(user => {
              if (user) {
                req.user = user; // modifying request
                return true;
              } else {
                // throw new Error('No User Registered with with such email');
                throw ('No User Registered with with such email');
              }
            }).catch(err => {
              throw new Error(err);
            })
          }),
        query('password', 'Password is required').isAlphanumeric()
      ];
  }

  static checkResetPasswordEmail(){
    return [
      query('email', 'Email is required').isEmail()
          .custom((email, { req }) => {
            return User.findOne({
              email: email,
              // type: 'user'
            }).then(user => {
              if (user) {
                return true;
              } else {
                // throw new Error('No User Registered with such email');
                throw ('No User Registered with such email');
              }
            }).catch(err => {
              throw new Error(err);
            })
          })
    ];
  }

  static verifyResetPasswordToken(){
    return [
      query('email', 'Email is required').isEmail(),
      query('reset_password_token', 'Reset password token is required').isNumeric()
          .custom((reset_password_token, { req }) => {
            return User.findOne({
              email: req.query.email,
              reset_password_token: reset_password_token,
              reset_password_token_time:{ $gt: Date.now() }
            }).then(user => {
              if (user) {
                return true;
              } else {
                // throw new Error('Reset password token does not exist.Please regenerate a new token.');
                throw ('Reset password token does not exist.Please regenerate a new token.');
              }
            }).catch(err => {
              throw new Error(err);
            })
          }),    
    ];
  }

  static resetPassword(){
    return [
      body('email', 'Email is required').isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email
          }).then(user => {
            if (user) {
              req.user = user;
              return true;
            } else {
              // throw new Error('No User registered with such email');
              throw ('No User registered with such email');
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
      body('new_password', 'New Password is required').isAlphanumeric(),
      body('otp', 'Reset Password token is required').isNumeric()
        .custom((reset_password_token, { req }) => {
          if (req.user.reset_password_token == reset_password_token) {
              return true
          } else {
            req.errorStatus = 422;
            // throw new Error('Reset Password token is  invalid, please try again');
              throw ('Reset Password token is  invalid, please try again');
          }
        })
    ];  
  }

  static verifyPhoneNumber(){
    return [
      body('phone', 'Phone Number is required').isString(),
    ];
  }

  static verifyUserProfile(){
    return [
      body('phone', 'Phone Number is required').isString(),
      body('email', 'Email is required').isEmail()
      .custom((email, { req }) => {
        // if(req.user.email === email)  throw ('Please provide a new unique email address to update the user profile. ');
          return User.findOne({
            email: email
          }).then(user => {
            if (user) {
              // throw new Error('A User with entered email already exists, please provide a unique email id');
              throw ('A User with entered email already exists, please provide a unique email id');
            } else {
              return true;
            }
          }).catch(err => {
            throw new Error(err);
          })       
      }),
      body('password', 'Password is required').isAlphanumeric(),      
    ];
  }
}
