import { body } from "express-validator";
import Restaurant from "../models/Restaurant";

export class OrderValidators{
  static placeOrder() {
    return [
      body('restaurant_id', 'Restaurant Id is required').isString()
        .custom((restaurant_id, { req }) => {
          return Restaurant.findById(restaurant_id).then(restaurant => {
            if (restaurant) {
              req.restaurant = restaurant;
              return true;
            } else {
              // throw new Error('Restaurant does not Exist');
              throw ('Restaurant does not Exist');
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
      body('order', 'Order is required').isString(),
      body('address', 'Address is required').isString(),
      body('status', 'Order Status is required').isString(),
      body('payment_status', 'Payment Status is required').isBoolean(),
      body('payment_mode', 'Payment Mode is required').isString(),
      body('total', 'Total is required').isNumeric(),
      body('grand_total', 'Order Grand Total is required').isNumeric(),
      body('delivery_charge', 'Delivery Charge is required').isNumeric(),
    ];
  }
}