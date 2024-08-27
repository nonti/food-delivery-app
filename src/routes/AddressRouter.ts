import { Router } from "express";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { AddressController } from "../controllers/AddressController";
import { AddressValidators } from "../validators/AddressValidators";

class AddressRouter {
	public router: Router;

	constructor() {
		this.router = Router();
		this.getRoutes();
		this.postRoutes();
		this.putRoutes();
		this.deleteRoutes();
	}

	getRoutes() {
    this.router.get('/userAddresses', GlobalMiddleWare.auth, AddressController.getUserAddresses);
    this.router.get('/checkAddress', GlobalMiddleWare.auth, AddressValidators.checkAddress(), GlobalMiddleWare.checkError, AddressController.checkAddress);
    this.router.get('/getUserLimitedAddresses', GlobalMiddleWare.auth, AddressValidators.getUserLimitedAddresses(), GlobalMiddleWare.checkError, AddressController.getLimitedAddress);
    this.router.get('/:id', GlobalMiddleWare.auth, AddressController.getAddressById);
  }

  postRoutes() {
    this.router.post('/create', GlobalMiddleWare.auth, AddressValidators.addAddress(), GlobalMiddleWare.checkError, AddressController.addAddress);
  }

  putRoutes() {
    this.router.put('/edit/:id', GlobalMiddleWare.auth, AddressValidators.editAddress(), GlobalMiddleWare.checkError, AddressController.editAddress);
  }

  deleteRoutes() {
    this.router.delete('/delete/:id', GlobalMiddleWare.auth, AddressController.deleteAddress);
  }
}

export default new AddressRouter().router;