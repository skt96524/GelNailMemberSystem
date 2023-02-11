import { print } from "listening-on";
import express, { NextFunction, Request, Response } from "express";
import { knex } from "./knex";
// import { HttpError } from "./http.error";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";
import cors from "cors";
import { memberRouter } from "./myshop/member.routes";
import { articleRoute } from "./article/article";
import { MycollectionController } from "./myCollections/mycollection.controller";
import { MycollectionService } from "./myCollections/mycollection.service";
import { MybookingController } from "./myBooking/mybooking.controller";
import { MybookingService } from "./myBooking/mybooking.service";
import { MypackageController } from "./myPackage/mypackage.controller";
import { MypackageService } from "./myPackage/mypackage.service";
import { productPicRouter } from "./myshop/productPic.routes";
import { myShopRouter } from "./myshop/myshop.routes";
import { HttpError } from "./http.error";

import { myshopplanRouter } from "./myshop/myshopplan.routes";

import { ProductService } from "./product/product.service";
import { ProductController } from "./product/product.controller";
import { shopRouter } from "./shop/shop.routes";
import { NotificationService } from "./notification/Notification.service";
import { NotificationController } from "./notification/Notification.controller";

let app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.static("uploads-sample"));
app.use("/uploads", express.static("uploads-sample"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userService = new UserService(knex);
const userController = new UserController(userService);
app.use(userController.router);
app.use(memberRouter);
app.use(articleRoute);
app.use(productPicRouter);
app.use(myShopRouter);
app.use(myshopplanRouter);
app.use(shopRouter);

const mycollectionService = new MycollectionService(knex);
const mycollectionController = new MycollectionController(mycollectionService);
app.use(mycollectionController.router);

const productService = new ProductService(knex);
const productController = new ProductController(productService);
app.use(productController.router);

const mybookingService = new MybookingService(knex);
const mybookingController = new MybookingController(mybookingService);
app.use(mybookingController.router);

const mypackageService = new MypackageService(knex);
const mypackageController = new MypackageController(mypackageService);
app.use(mypackageController.router);

app.use(myshopplanRouter);

const notificationService = new NotificationService(knex);
const notificationController = new NotificationController(notificationService);
app.use(notificationController.router);

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.statusCode || 500);
  res.json({ error: String(error) });
});

let port = 8100;
app.listen(port, () => {
  print(port);
});
