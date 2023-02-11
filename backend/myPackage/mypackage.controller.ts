import { HttpController } from "../http.controller";
import { Request } from "express";

import { MypackageService } from "./mypackage.service";

import { getJWTPayload } from "../jwt";
import { HttpError } from "../http.error";

export class MypackageController extends HttpController {
    constructor(public myPackageService: MypackageService) {
        super();
        this.router.get("/myValidPackage", this.wrapMethod(this.getMyValidPackage));
        this.router.get('/myInvalidPackage', this.wrapMethod(this.getMyInvalidPackage));
        this.router.get('/myValidPackageDetail', this.wrapMethod(this.getMyValidPackageDetail));


    }



    getMyValidPackage = (req: Request) => {

        let jwt = getJWTPayload(req)
        return this.myPackageService.getMyValidPackage(jwt.id)
    }

    getMyInvalidPackage = (req: Request) => {

        let jwt = getJWTPayload(req)
        return this.myPackageService.getMyInvalidPackage(jwt.id)
    }

    getMyValidPackageDetail = (req: Request) => {

        let jwt = getJWTPayload(req)
        let userPackageID = req.params.id;
        if (!jwt.id) {
            throw new HttpError(400, "invalid booking id");
        }
        if (!userPackageID) {
            throw new HttpError(400, "invalid booking id");
        }
        return this.myPackageService.getMyValidPackage(jwt.id)
    };
}




