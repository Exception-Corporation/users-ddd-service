import express, {
  Application as app,
  Request,
  Response,
  NextFunction,
} from "express";
import bodyParser from "body-parser";
import { Server } from "../../domain/interfaces/server.interface";
import { UserRouter } from "../../../user/v1/infrastructure/routers/user.router";
import config from "../config";

export class Application implements Server<app> {
  private app: app;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use((_req: Request, res: Response, next: NextFunction) => {
      res.header("Acess-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accetp, Access-Control-Allow-Request-Method"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
      );
      res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

      next();
    });

    this.app.use("/", new UserRouter().getRoutes());
  }

  getApp() {
    return {
      app: this.app,
      initialize: async () => {
        const { project } = config;
        this.app.listen(project.port, () => {
          console.info(
            `Server [Express] listen on port: [${project.host}:${project.port}] in mode: ${project.mode}`
          );
        });
      },
    };
  }
}
