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
    refreshToken: null,
    token: null,
    success: false,
    message: "",
  };
  const { email, password } = body;
  const user = await db("users").where({ email }).first();
  if(!user.approved){
    loggedIn.message = "User is not approved";
    return loggedIn;
  }
  if (!user) {
    loggedIn.message = "The user does not exist";
    return loggedIn;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    loggedIn.message = "Wrong password";
    return loggedIn;
  }

  const token = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await db("users")
    .where({ id: user.id })
    .update({ refresh_token: refreshToken });

  loggedIn.token = token;
  loggedIn.refreshToken = refreshToken;
  loggedIn.success = true;
  loggedIn.message = "Login successful";
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
  const newAccessToken = generateAccessToken((payload as any).userId);
  return newAccessToken;
};

const generateAccessToken = (user:any): string => {
  return jwt.sign({ "id":user.id,"role":user.role }, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (user: any): string => {
  return jwt.sign({ "id":user.id,"role":user.role }, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

const promotionUser = async (id: number) => {
  let success:boolean=false;
  const user = await db('users')
  .where({ id })
  .first();
  if (!user) {
    return success;
  }
  try{
    
    await db('users')
    .where({ id })
    .update({ role: 'admin' })
    success=true;
  }catch(err){
    console.log(err);
  }
  return success;
}

const approveUser = async (id: number) => {
  let success:boolean=false;
  const user = await db('users')
  .where({ id })
  .first();
  if (!user) {
    return success;
  }
  try{
    
    await db('users')
    .where({ id })
    .update({ approved: true }) 
    success=true;
  }catch(err){
    console.log(err);
  }
  return success;
}
export { updateToken, login, register, promotionUser,approveUser };
