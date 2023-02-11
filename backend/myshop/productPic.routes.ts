import express from "express";
import { myShopService, productPicService } from "../services";
import { form, uploadDir } from "../uploads";
import { ProductPicController } from "./productPic.controller";

export const productPicRouter = express.Router();

let productPicController = new ProductPicController(
  productPicService,
  form,
  myShopService
);

productPicRouter.get("/shops/products", productPicController.getProductPic);
productPicRouter.delete("/products/:id", productPicController.delProductPic);
productPicRouter.post("/shops/products", productPicController.addPhoto);
productPicRouter.use("/uploads", express.static(uploadDir));
