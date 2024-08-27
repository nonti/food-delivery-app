import * as express from 'express';
import * as mongoose from 'mongoose';
import { getEnvironmentVariables } from './environments/environment';
import * as bodyParser from 'body-parser';
import UserRouter from './routes/UserRouter';
import * as cors from 'cors';
import BannerRouter from './routes/BannerRouter';
import CityRouter from './routes/CityRouter';
import RestaurantRouter from './routes/RestaurantRouter';
import CategoryRouter from './routes/CategoryRouter';
import ItemRouter from './routes/ItemRouter';
import AddressRouter from './routes/AddressRouter';
import OrderRouter from './routes/OrderRouter';

export class Server {

  public app: express.Application = express();

  constructor() {
    this.setConfigs();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }

  setConfigs() {
    this.connectMongoDB();
    this.allowCors();
    this.configureBodyParser();

  }

  connectMongoDB() {
    mongoose.connect(getEnvironmentVariables().db_uri).then(() => {
      console.log('Connected to MongoDB');
    });
  }

  configureBodyParser(){
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
  }

  allowCors(){
    this.app.use(cors());
  }

  setRoutes() {
    this.app.use('/src/uploads', express.static('src/uploads'));
    this.app.use('/api/user', UserRouter);
    this.app.use('/api/banner', BannerRouter);
    this.app.use('/api/city', CityRouter);
    this.app.use('/api/restaurant', RestaurantRouter);
    this.app.use('/api/category', CategoryRouter);
    this.app.use('/api/item', ItemRouter);
    this.app.use('/api/address', AddressRouter);
    this.app.use('/api/order', OrderRouter);
  }

  error404Handler() {
    this.app.use((req,res) => {
      res.status(404).json({
        message: 'Not found',
        status_code: 404
      });
    });
  }

  handleErrors() {
    this.app.use((error, req, res, next) => {
      const errorStatus = error.errorStatus || 500;
      res.status(errorStatus).json({
        message: error.message  || 'Something went wrong. Please try again...ok ',
        status_code: errorStatus
      });
    });
  }

}
