import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
require("dotenv").config();

let hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));

const registerService = ({ phone, password, name }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await db.User.findOrCreate({
        where: { phone },
        defaults: {
          phone,
          name,
          password: hashPassword(password),
          id: v4(),
        },
      });

      let token =
        response[1] &&
        jwt.sign(
          { id: response[0].id, phone: response[0].phone },
          process.env.SECRET_KEY,
          { expiresIn: "2d" }
        );
      resolve({
        err: token ? 0 : 2,
        msg: token ? "register is successfully" : "Phone number has been used",
        token: token || null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const loginService = ({ phone, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await db.User.findOne({
        where: { phone },
        raw: true,
      });

      let isCorrectPassword =
        response && bcrypt.compareSync(password, response.password);

      let token =
        isCorrectPassword &&
        jwt.sign(
          { id: response.id, phone: response.phone },
          process.env.SECRET_KEY,
          { expiresIn: "2d" }
        );
      resolve({
        err: token ? 0 : 2,
        msg: token
          ? "login is successfully"
          : response
          ? "password is incorrect"
          : "Phone number not found",
        token: token || null,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  registerService,
  loginService,
};
