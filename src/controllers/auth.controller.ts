import bcrypt from "bcryptjs";
import db from "../config/knex";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import loggedIn from "../interfaces/LoggedIn.interface";
dotenv.config();

const register = async (body: any) => {
  let registered = { success: false, message: "" };
  const { email, password } = body;
  const users = await db("users").select("*");
  const hashed = await bcrypt.hash(password, 10);
  const existing = await users.find((u) => u.email === email);
  if (email === "" || !email) {
    registered.message = "The email is empty";
    return;
  }
  if (password === "" || !password) {
    registered.message = "The password is empty";
    return;
  }
  if (existing) {
    registered.message = "User already exists";
    return registered;
  }

  try {
    await db("users").insert({ email, password: hashed });
    registered.success = true;
    registered.message = "User registered successfully";
  } catch (err) {
    console.log(err);
  }

  return registered;
};

const login = async (body: any) => {
  const loggedIn: loggedIn = {
    success: false,
    message: "",
    user: {
      accessToken: null,
      refreshToken: null,
      role: null,
      approved: null,
      id: 0,
      email: "",
      name: "",
    },
  };
  const { email, password } = body;
  const user = await db("users").where({ email }).first();

  if (!user) {
    loggedIn.message = "User does not exist";
    return loggedIn;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    loggedIn.message = "Wrong password";
    return loggedIn;
  }
  if (!user.approved) {
    loggedIn.message = "User is not approved";
    return loggedIn;
  }

  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await db("users")
    .where({ id: user.id })
    .update({ refresh_token: refreshToken }); // save refreshtoken to db

  setUserData(loggedIn, user, token, refreshToken);

  loggedIn.success = true;
  loggedIn.message = "Login successful";
  return loggedIn;
};

const setUserData = (
  loggedIn: loggedIn,
  user: any,
  token: string,
  refreshToken: string
) => {
  loggedIn.user.approved = user.approved;
  loggedIn.user.role = user.role;
  loggedIn.user.accessToken = token;
  loggedIn.user.refreshToken = refreshToken;
  loggedIn.user.id = user.id;
  loggedIn.user.email = user.email;
  return loggedIn;
};

const updateToken = async (refreshToken: string = "") => {
  let storedToken: any = "";
  if (refreshToken === "") return "Token not found";
  storedToken = await db("users")
    .select("refresh_token")
    .where({ refresh_token: refreshToken })
    .first();

  if (!storedToken) {
    return null;
  }
  const payload = jwt.verify(
    storedToken.refresh_token,
    process.env.JWT_REFRESH_TOKEN_SECRET as string
  );
  const newAccessToken = generateAccessToken(payload);
  return newAccessToken;
};

const generateAccessToken = (user: any): string => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1h",
    }
  );
};

const generateRefreshToken = (user: any): string => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

const promotionUser = async (id: number) => {
  const result = {
    success: false,
    message: "",
  };
  const user = await db("users").where({ id }).first();
  if (!user) {
    return result;
  }
  try {
    await db("users").where({ id }).update({ role: "admin" });
    result.success = true;
  } catch (err) {
    console.log(err);
  }
  return result;
};

const approveUser = async (id: number) => {
  const result = {
    success: false,
    message: "",
  };
  const user = await db("users").where({ id }).first();
  if (!user) {
    return result;
  }
  try {
    await db("users").where({ id }).update({ approved: true });
    result.success = true;
    result.message = "User approved successfully";
  } catch (err) {
    console.log(err);
    result.message = "User not found to approve";
  }
  return result;
};

const listUsers = async () => {
  return await db("users").select("*");
};

const deleteUser = async (id: number) => {
  const result = {
    success: false,
    message: "",
  };
  const user = await db("users").where({ id }).first();
  if (!user) {
    result.message = "User not found to delete";
    return result;
  }
  try {
    await db("users").where({ id }).del();
    result.success = true;
    result.message = "User deleted successfully";
  } catch (err) {
    console.log(err);
    result.message = "User not found to delete";
  }
  return result;
};
const getWidgetOrder = async (id: string) => {
  const result = {
    success: false,
    message: "",
    widgetOrder: [],
  };
  try {
    result.widgetOrder = (
      await db("users").where({ id }).select("widget_order")
    )
      .splice(0, 1)[0]
      .widget_order.split(",")
      .map(Number);
    result.success = true;
    result.message = "User widget order fetched successfully";
  } catch (err) {
    console.log(err);
    result.message = "User not found to fetch widget order";
  }
  return result;
};

const setWidgetOrder = async (id: string, order: string) => {
  const result = {
    success: false,
    message: "",
  };
  const userExist = await db("users").where({ id }).first();
  if (!userExist) {
    result.message = "User not found to set widget order";
    return result;
  }
  if (!hasOnlyNumbersAndCommas(order)) {
    result.message = "Wrong order data to set widget order";
    return result;
  }
  if (!id || !order) {
    result.message = "Wrong data to set widget order";
    return result;
  }
  try {
    await db("users").where({ id }).update({ widget_order: order });
    result.success = true;
    result.message = "User widget order set successfully";
  } catch (err) {
    result.message = "Error to set widget order";
  }
  return result;
};

const hasOnlyNumbersAndCommas = (str: string) => {
  // Ellenőrzi, hogy a sztring elejétől a végéig
  // csak számjegyeket (0-9) vagy vesszőt tartalmaz-e.
  const regex = /^[0-9,]+$/;
  return regex.test(str);
};

export {
  updateToken,
  login,
  register,
  promotionUser,
  approveUser,
  listUsers,
  deleteUser,
  getWidgetOrder,
  setWidgetOrder,
};
