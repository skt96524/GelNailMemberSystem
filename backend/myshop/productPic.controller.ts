import { ProductPicService } from "./productPic.service";
import { NextFunction, Request, Response } from "express";
import { Formidable, toArray } from "../uploads";
import { HttpError } from "../http.error";
import { getJWTPayload } from "../jwt";
import { MyShopService } from "./myshop.service";

export class ProductPicController {
  constructor(
    public productPicService: ProductPicService,
    private form: Formidable,
    public myShopService: MyShopService
  ) {}

  addPhoto = async (req: Request, res: Response, next: NextFunction) => {
    this.form.parse(req, async (error, fields, files) => {
      try {
        if (error) throw error;

        let image = toArray(files.image)[0]?.newFilename;
        if (!image) throw new HttpError(400, "missing image");

        let user_id = getJWTPayload(req).id;
        let shop_id = await this.myShopService.getShopID(user_id);
        let intro = fields.intro;

        await this.myShopService.checkShopOwner({ user_id, shop_id });

        await this.productPicService.addPhoto({ intro, image, shop_id });

        res.status(200).json({ message: "success" });
      } catch (error) {
        next(error);
      }
    });
  };

  getProductPic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let users_id = getJWTPayload(req).id;
      let shop_id = await this.myShopService.getShopID(users_id);

      if (!shop_id) throw new HttpError(400, "invalid shop id");

      let json = await this.productPicService.getProductPic(shop_id);
      res.status(200).json(json);
    } catch (error) {
      next(error);
    }
  };

  delProductPic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let id = +req.params.id;
      if (!id) throw new HttpError(400, "invalid product id");
      let json = await this.productPicService.delProductPic(id);
      res.status(200).json(json);
    } catch (error) {
      next(error);
    }
  };
}
