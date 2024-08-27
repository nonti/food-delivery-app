import Category from "../models/Category";
import Item from "../models/Item";

export class ItemController {
  static async addItem(req, res, next){
    const data = req.body;
    const path = req.file.path;
    try {
        let item_data: any = {
          name: data.name,
          status: data.status,
          price: parseInt(data.price),
          veg: data.veg,
          restaurant_id: data.restaurant_id,
          category_id: data.category_id,
          cover: path
        };
        if(data.description) item_data = {...item_data, description: data.description};
        const item_doc = await new Item(item_data).save();
      res.send(item_doc);
    } catch (e) {
      next(e);
    }
  }

  static async getMenu(req, res, next){
    const restaurant = req.restaurant;
    try {
         const categories = await Category.find({restaurant_id: restaurant._id}, {__v:0});
         const items = await Item.find(
          {
            // status: true,
            restaurant_id: restaurant._id,
         }
        )
        res.json({
          restaurant,
          categories,
          items,
        });
    } catch (e) {
      next(e);
    }
  }
}