import { Request, Response } from "express";
import { TYPES } from "../di/types";

export const userController = ({ [TYPES.UserService]: userService }) => ({
  getUsers: async (req: Request, res: Response) => {
    const users = await userService.getAll();
    res.json(users);
  },
});
