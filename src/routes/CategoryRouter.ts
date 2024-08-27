import { Router } from 'express';
import { GlobalMiddleWare } from '../middlewares/GlobalMiddleWare';
import { CategoryController } from '../controllers/CategoryController';

export class CategoryRouter{

  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.deleteRoutes();
    this.patchRoutes();
    this.postRoutes();
    this.putRoutes();
  }

  getRoutes() {
    this.router.get('/getCategories/:restaurantId', GlobalMiddleWare.auth, CategoryController.getCategoriesByRestaurants);
  }

  postRoutes() {}

  putRoutes() {}

  deleteRoutes() {}

  patchRoutes() {}
}

export default new CategoryRouter().router;