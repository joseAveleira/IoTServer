import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";

function createToken(user: IUser): string {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
}

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "please. Send your email and password" });
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ msg: "the user already exist" });
  }
  const newUser = new User(req.body);
  await newUser.save();
  return res.status(201).json(newUser);
};

export const signIn = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "please. Send your email and password" });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: "The user does not exist" });
  } else {
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      return res.status(200).json({ token: createToken(user) });
    } else {
      return res.status(400).json({
        msg: "The email or password are incorrect",
      });
    }
  }
};
