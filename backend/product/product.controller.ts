import { HttpController } from "../http.controller";
import { Request } from "express";
import { ProductService } from "./product.service";
import { int, number, object, optional, string } from "cast.ts";
import { getJWTPayload } from "../jwt";

export class ProductController extends HttpController {
  constructor(public productService: ProductService) {
    super();
    this.router.get("/productsList", this.wrapMethod(this.getProductsList));
    this.router.get(
      "/performanceProduct/:id",
      this.wrapMethod(this.getPerformance)
    );
    this.router.post("/likeProduct", this.wrapMethod(this.addLikeProduct));
    this.router.delete("/likeProduct", this.wrapMethod(this.removeLikeProduct));
    this.router.post(
      "/collectProduct",
      this.wrapMethod(this.addProductCollection)
    );
    this.router.delete(
      "/collectProduct",
      this.wrapMethod(this.removeProductCollection)
    );
  }

  getProductsList = (req: Request) => {
    // let productType = req.query.productType || "";
    // let offset = req.query.offset || "";
    // let searchText = req.query.searchText || "";
    let { query } = object({
      query: object({
        productType: optional(string({ trim: true })),
        offset: optional(int({ min: 0 })),
        searchText: optional(string({ trim: true })),
        shop_id: optional(number({ min: 1 })),
        collecter_id: optional(number({ min: 1 })),
      }),
    }).parse(req);
    // let jwt = getJWTPayload(req);
    return this.productService.getProductsList(query);
  };

  getPerformance = (req: Request) => {
    let jwt = getJWTPayload(req);
    let users_id = jwt.id;
    let products_id = req.params.id;
    if (!jwt.id || jwt.id != users_id) {
      throw new Error("Unauthorized");
    }
    return this.productService.getPerformance(users_id, products_id);
  };
  addLikeProduct = (req: Request) => {
    let jwt = getJWTPayload(req);
    let { users_id, id } = req.body;
    let products_id = id;
    if (!jwt.id || jwt.id != users_id) {
      throw new Error("Unauthorized");
    }
    return this.productService.addLikeProduct(users_id, products_id);
  };
  removeLikeProduct = (req: Request) => {
    let jwt = getJWTPayload(req);
    let { users_id, id } = req.body;
    let products_id = id;
    if (!jwt.id || jwt.id != users_id) {
      throw new Error("Unauthorized");
    }
    return this.productService.removeLikeProduct(users_id, products_id);
  };
  addProductCollection = (req: Request) => {
    let jwt = getJWTPayload(req);
    let { users_id, id } = req.body;
    let products_id = id;
    if (!jwt.id || jwt.id != users_id) {
      throw new Error("Unauthorized");
    }
    return this.productService.addProductCollection(users_id, products_id);
  };
  removeProductCollection = (req: Request) => {
    let jwt = getJWTPayload(req);
    let { users_id, id } = req.body;
    let products_id = id;
    if (!jwt.id || jwt.id != users_id) {
      throw new Error("Unauthorized");
    }
    return this.productService.removeProductCollection(users_id, products_id);
  };
}
