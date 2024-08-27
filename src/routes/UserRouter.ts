import { Router } from 'express';
import { UserValidators } from '../validators/UserValidators';
import { UserController } from '../controllers/UserController';
import { GlobalMiddleWare } from '../middlewares/GlobalMiddleWare';

 class UserRouter{
    public router: Router;

    constructor(){
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
    }
    
    getRoutes(){
        this.router.get('/send/verification/email', GlobalMiddleWare.auth, UserController.resendVerificationEmail);
        this.router.get('/signin', UserValidators.signin(),  GlobalMiddleWare.checkError, UserController.signin);
        this.router.get('/send/reset/password/token', UserValidators.checkResetPasswordEmail(), GlobalMiddleWare.checkError, UserController.sendResetPasswordOtp);
        this.router.get('/verify/resetPasswordToken', UserValidators.verifyResetPasswordToken(), GlobalMiddleWare.checkError, UserController.verifyResetPasswordToken);    
        this.router.get('/profile', GlobalMiddleWare.auth, UserController.profile);
        }

    postRoutes(){
        this.router.post('/signup', UserValidators.signup(),GlobalMiddleWare.checkError, UserController.signup);
        this.router.post('/refreshToken', UserValidators.checkRefreshToken(),GlobalMiddleWare.checkError, UserController.getNewToken);

    }
    patchRoutes(){
        this.router.patch('/reset/password', UserValidators.resetPassword(),GlobalMiddleWare.checkError, UserController.resetPassword);
        this.router.patch('/verify/emailToken',  GlobalMiddleWare.auth, UserValidators.verifyUserEmailToken(),GlobalMiddleWare.checkError, UserController.verifyUserEmailToken);
        this.router.patch('/update/phone', GlobalMiddleWare.auth, UserValidators.verifyPhoneNumber(),GlobalMiddleWare.checkError, UserController.updatePhoneNumber);
        this.router.patch('/update/profile', GlobalMiddleWare.auth, UserValidators.verifyUserProfile(),GlobalMiddleWare.checkError, UserController.updateUserProfile);
    }
}

export default new UserRouter().router;   