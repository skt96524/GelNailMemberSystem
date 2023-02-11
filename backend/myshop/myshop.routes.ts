import express from "express";
import { myShopService } from "../services";
import { MyShopController } from "./myshop.controller";

export const myShopRouter = express.Router();
let myShopController = new MyShopController(myShopService);

myShopRouter.get("/myshopid", myShopController.getshopID);
myShopRouter.get("/checkapplyshop", myShopController.checkApplyShop);
myShopRouter.get("/shopinfo", myShopController.getshopinfo);
myShopRouter.post("/createshop", myShopController.createShop);
myShopRouter.post("/updateshopstatus", myShopController.updateShopStatus);
