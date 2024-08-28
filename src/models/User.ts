import * as mongoose from 'mongoose';
import {model} from 'mongoose';

const userSchema = new mongoose.Schema({
    email:{type: String, required: true},
    email_verified:{type: Boolean, required: true, default: false},
    verification_token:{type: Number, required: true},
    verification_token_time:{type: Date, required: true, default: new Date()},
		name: {type: String, require: true},
		password:{type: String, required: true},
    reset_password_token:{type: Number, required: false},
    reset_password_token_time:{type: Date, required: false},
		phone:{type: String, required: true},
		type: {type: String, required: true},
    status: {type: String, required: true},
    // uuid:{type: String},
		created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()}		
	});

export default model('users', userSchema);