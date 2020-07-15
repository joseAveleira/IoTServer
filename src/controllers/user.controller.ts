import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";
import uidAPIKey from "uuid-apikey";

function createToken(user: IUser): string {
  return jwt.sign({ id: user.id, alias: user.alias }, config.jwtSecret);
}

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.alias || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "please. Send your alias and password" });
  }
  const user = await User.findOne({ alias: req.body.alias });
  if (user) {
    return res.status(400).json({ msg: "the user already exist" });
  }

  const newUser = new User(req.body);
  console.log(uidAPIKey.create(req.body.alias).apiKey);
  1;
  newUser.mqttAccess = uidAPIKey.create(req.body.alias).apiKey;
  await newUser.save();
  return res.status(201).json(newUser);
};

export const signIn = async (req: Request, res: Response) => {
  console.log("peticion signin");
  console.log(req.body);
  if (!req.body.alias || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "please. Send your alias and password" });
  }
  const user = await User.findOne({ alias: req.body.alias });
  if (!user) {
    return res.status(400).json({ msg: "The user does not exist" });
  } else {
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      return res.status(200).json({ token: createToken(user), apiKey:user.mqttAccess });
    } else {
      return res.status(400).json({
        msg: "The alias or password are incorrect",
      });
    }
  }
};

export const loginMQTT = async (user: string, password: string) => {
  const userMQTT = await User.findOne({ alias: user, mqttAccess: password });
  // console.log(user);
  // console.log(password);
  if (!userMQTT) {
    return false;
  } else {
    return true;
  }
};
