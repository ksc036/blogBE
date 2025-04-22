import { Request, Response } from "express";
import { TYPES } from "../di/types";
import { UserService } from "./user.service";

export const userController = ({
  [TYPES.UserService]: userService,
}: {
  [TYPES.UserService]: UserService;
}) => ({
  getUsers: async (req: Request, res: Response) => {
    console.log("getUsers called");
    const users = await userService.getAll();
    res.json(users);
  },
});
