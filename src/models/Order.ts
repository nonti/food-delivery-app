import * as mongoose from 'mongoose';
import {model} from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  restaurant_id: { type: mongoose.Types.ObjectId, ref: "restaurants",  required: true,},
  order: { type: String, required: true },
  instruction: { type: String },
  address: { type: Object, required: true },
  status: { type: String, required: true },
  total: { type: String, required: true },
  grand_total: { type: Number, required: true },
  delivery_charge: { type: Number, required: true },
  payment_status: { type: Boolean, required: true },
  payment_mode: { type: String, required: true },
  created_at: { type: Date, required: true, default: new Date().toString()},
  updated_at: { type: Date, required: true, default: new Date() },
});

export default model('orders', orderSchema);