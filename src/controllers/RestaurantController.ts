import Banner from "../models/Banner";
import Category from "../models/Category";
import Restaurant from "../models/Restaurant";
import User from "../models/User";
import { Utils } from "../utils/Utils";

export class RestaurantController {
  static async addRestaurant(req, res, next) {
    const restaurant = req.body;
    const path = req.file.path;
    const verification_token = Utils.generateVerificationToken();
    try {
      //create restaurant user
      const hash = await Utils.encryptPassword(restaurant.password);
      const data = {
        email: restaurant.email,
        verification_token,
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        password: hash,
        name: restaurant.name,
        phone: restaurant.phone,
        type: 'restaurant',
        status: 'active',
      };
      const user = await new User(data).save();

      //create restaurant
      let restaurant_data: any = {
        name: restaurant.res_name,
        short_name: restaurant.short_name,
        location: JSON.parse(restaurant.location),
        address: restaurant.address,
        open_time: restaurant.open_time,
        close_time: restaurant.close_time,
        status: restaurant.status,
        cuisines: JSON.parse(restaurant.cuisines),
        price: parseInt(restaurant.price),
        delivery_time: parseInt(restaurant.delivery_time),
        city_id: restaurant.city_id,
        user_id: user._id,
        cover: path
      };
      if (restaurant.description) restaurant_data = { ...restaurant_data, description: restaurant.description };
      const restaurant_doc = await new Restaurant(restaurant_data).save();

       //create categories
       const categories_data = JSON.parse(restaurant.categories).map(x => {
        return { name: x, restaurant_id: restaurant_doc._id };
      });
      const categories = Category.insertMany(categories_data);
      res.send(restaurant_doc);
    } catch (e) {
      next(e);
    }
  }

  static async getNearbyRestaurants(req, res, next){
    // const METRE_PER_MILE = 1609.34;
    // const METRE_PER_KM = 1000;
    // const EARTH_RADIUS_IN_MILE = 3963.2;
    const EARTH_RADIUS_IN_KM = 6378.1;
    const data = req.query;
    const perPage = 5;
    const currentPage = parseInt(data.page) || 1;
    const prevPage = currentPage == 1 ? null : currentPage - 1;
    let nextPage = currentPage + 1;
    try {
      const restaurants_doc_count = await Restaurant.countDocuments(
        {
          status: 'active',
          location: {
      //       // $nearSphere: {
      //       //   $geometry: {
      //       //     type: 'Point',
      //       //     coordinates: [parseFloat(data.lng), parseFloat(data.lat)]
      //       //   },
      //       //   $maxDistance: data.radius * METERS_PER_KM
      //       // }
            $geoWithin: {
              $centerSphere: [[parseFloat(data.lng), parseFloat(data.lat)],
                (parseFloat(data.radius) / EARTH_RADIUS_IN_KM) 
              ]
            }        
          } 
        }  
      );
      //send empty array if no document on filter query exists
      if (!restaurants_doc_count) {
        res.json({
        restaurants: [],
        perPage,
        currentPage,
        prevPage,
        nextPage: null,
        totalPages: 0,
        // totalRecords: resturants_doc_count
      });
      }
      const totalPages = Math.ceil(restaurants_doc_count / perPage);
      if (totalPages == 0 || totalPages == currentPage) {
        nextPage = null;
      }

      if (totalPages < currentPage) {
        throw ('No more Restaurants available');
      }
      const restaurants = await Restaurant.find(
        {
          status: 'active',
          location: {
            // $nearSphere: {
            //   $geometry: {
            //     type: 'Point',
            //     coordinates: [parseFloat(data.lng), parseFloat(data.lat)]
            //   },
            //   $maxDistance: data.radius * EARTH_RADIUS_IN_KM
            $geoWithin: {
              $centerSphere: [
                [parseFloat(data.lng), parseFloat(data.lat)],
                parseFloat(data.radius) / EARTH_RADIUS_IN_KM
              ]
            }        
          } 
        }
      )
      .skip((perPage * currentPage) - perPage)
      .limit(perPage);
      res.send(restaurants);
      res.json({
        restaurants,
        perPage,
        currentPage,
        prevPage,
        nextPage,
        totalPages,
        // totalRecords: resturants_doc_count
      });
    } catch (e) {
      next(e);
    }
  }

  static async searchNearbyRestaurants(req, res, next){
    // const METRE_PER_MILE = 1609.34;
    // const METRE_PER_KM = 1000;
    // const EARTH_RADIUS_IN_MILE = 3963.2;
    const EARTH_RADIUS_IN_KM = 6378.1;
    const data = req.query;
    const perPage = 5;
    const currentPage = parseInt(req.query.page) || 1;
    const prevPage = currentPage == 1 ? null : currentPage - 1;
    let nextPage = currentPage + 1;
    try {
      const restaurant_doc_count = await Restaurant.countDocuments(
        { 
        status: 'active',
          name: {$regex: data.name, $options: 'i'},
          location: {
            // $nearSphere: {
            //   $geometry: 
            //   {
            //     type: 'Point',
            //     coordiantes: [parseFloat(data.lng), parseFloat(data.lat)]  
            //   },
            //   $maxDistance: 5 * METRE_PER_KM
            // }
            $geoWithin: { 
              $centerSphere: [ 
                  [parseFloat(data.lng), parseFloat(data.lat)], 
                  (parseFloat(data.radius) / EARTH_RADIUS_IN_KM)
                ],
              } 
            }
          }
        );
      if (!restaurant_doc_count) {
        //send empty array if no document on filter query exists
        res.json({
          restaurants:[],
          perPage,
          currentPage,
          prevPage,
          nextPage:null,
          totalPages:0,
          // totalRecords: order_doc_count
        });
      }
      const totalPages = Math.ceil(restaurant_doc_count / perPage);
      if (totalPages == 0 || totalPages == currentPage) {
        nextPage = null;
      }

      if (totalPages < currentPage) {
        throw ('No more Restuarant available');
      }
      const restaurants = await Restaurant.find(
        {
          status: 'active',
          name: {$regex: data.name, $options: 'i'},
          location: {
            // $nearSphere: {
            //   $geometry: 
            //   {
            //     type: 'Point',
            //     coordiantes: [parseFloat(data.lng), parseFloat(data.lat)]  
            //   },
            //   $maxDistance: 5 * METRE_PER_KM
            // }
            $geoWithin: { 
              $centerSphere: [ 
                  [parseFloat(data.lng), parseFloat(data.lat)], 
                  (parseFloat(data.radius) / EARTH_RADIUS_IN_KM)
                ],
                // $distanceField: 'distance' 
              } 
            }
          }
        )
        .skip((perPage * currentPage) - perPage)
        .limit(perPage);
        // res.send(restaurants);
        res.json({
          restaurants:[],
          perPage,
          currentPage,
          prevPage,
          nextPage:null,
          totalPages:0,
          // totalRecords: order_doc_count
        });
    } catch (e) {
      next(e);
    }
  }

  static async getRestaurants(req, res, next){
    try {
      const restaurants = await Restaurant.find(
        {
          status: 'active'
        }
      );
      res.send(restaurants);
    } catch (e) {
      next(e);
    }
  }
}