import { Router } from "express";
import { BannerValidators } from "../validators/BannerValidators";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { BannerController } from "../controllers/BannerController";
import { Utils } from "../utils/Utils";

class BannerRouter {
	public router: Router;

	constructor() {
		this.router= Router();
		this.getRoutes();
		this.postRoutes();
		this.patchRoutes();
		this.putRoutes();
		this.deleteRoutes();
	}

	getRoutes() { 
		this.router.get('/banners', GlobalMiddleWare.auth,BannerController.getBanners);
	}

	postRoutes() { 
		this.router.post('/create', GlobalMiddleWare.auth, GlobalMiddleWare.adminRole, new Utils().multer.single('bannerImages'), BannerValidators.addBanner(), GlobalMiddleWare.checkError, BannerController.addBanner);
	}

	patchRoutes() { 
	}

	putRoutes() { 
	}

	deleteRoutes() { 
	}
}

export default new BannerRouter().router;