import { tokenPayload } from "../../users/types";
import "express";

declare module "express" {
  interface Request {
    tokenPayload?: tokenPayload;
  }
}
