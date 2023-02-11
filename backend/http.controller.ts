import { NextFunction, Request, Response, Router } from "express";

export class HttpController {
  public router = Router();

  wrapMethod(fn: (req: Request) => any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let json = await fn(req);
        // setTimeout(() => {
        res.json(json);
        // }, 5000)
      } catch (error) {
        next(error);
      }
    };
  }
}
