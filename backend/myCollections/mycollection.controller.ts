import { HttpController } from "../http.controller";
import { Request } from "express";
import { MycollectionService } from "./mycollection.service";
import { getJWTPayload } from "../jwt";

export class MycollectionController extends HttpController {
  constructor(public myCollectionService: MycollectionService) {
    super();
    this.router.get(
      "/bookmarkArticle",
      this.wrapMethod(this.getMyBookMarkArticle)
    );
    this.router.get("/bookmarkShop", this.wrapMethod(this.getMyBookMarkShop));
    this.router.get("/bookmarkNail", this.wrapMethod(this.getMyBookMarkNail));
  }

  getMyBookMarkArticle = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.myCollectionService.getMyBookMarkArticle(jwt.id);
  };

  getMyBookMarkShop = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.myCollectionService.getMyBookMarkShop(jwt.id);
  };

  getMyBookMarkNail = (req: Request) => {
    let jwt = getJWTPayload(req);
    return this.myCollectionService.getMyBookMarkNail(jwt.id);
  };
}
