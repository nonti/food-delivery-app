import { Router } from "express";
import { RestaurantValidators } from "../validators/RestaurantValidators";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { RestaurantController } from "../controllers/RestaurantController";
import { Utils } from "../utils/Utils";

class RestaurantRouter {
	public router: Router;

	constructor() {
		this.router = Router();
		this.getRoutes();
		this.postRoutes();
		this.patchRoutes();
		this.putRoutes();
		this.deleteRoutes();
	}

	getRoutes() { 
		this.router.get('/getRestaurants', GlobalMiddleWare.auth, RestaurantController.getRestaurants);
		this.router.get('/nearbyRestaurants', GlobalMiddleWare.auth, RestaurantValidators.getNearbyRestaurant(), GlobalMiddleWare.checkError, RestaurantController.getNearbyRestaurants);
		this.router.get('/searchNearbyRestaurants', GlobalMiddleWare.auth, RestaurantValidators.searchNearbyRestaurant(), GlobalMiddleWare.checkError, RestaurantController.searchNearbyRestaurants);

	}

	postRoutes() { 
		this.router.post('/create', GlobalMiddleWare.auth, GlobalMiddleWare.adminRole, new Utils().multer.single('restaurantImages') ,RestaurantValidators.addRestaurant(), GlobalMiddleWare.checkError, RestaurantController.addRestaurant);
	}

	patchRoutes() { 
		this.router.patch('/',);
	}

	putRoutes() { 
		this.router.put('/',);
	}

	deleteRoutes() { 
		this.router.delete('/',);
	}
}

export default new RestaurantRouter().router;