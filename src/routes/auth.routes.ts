import { Router, Request, Response } from "express";
import {
  promotionUser,
  login,
  register,
  updateToken,
  approveUser,
  listUsers,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/roles.middleware";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const registered = await register(req.body);

  if (registered?.success) {
    res.json(registered);
  } else {
    res.status(400).json(registered);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const loggedIn = await login(req.body);
  if (loggedIn?.success) {
    res.json(loggedIn);
  } else {
    res.status(400).json(loggedIn);
  }
});

router.put("/refresh-token", async (req: Request, res: Response) => {
  const token = await updateToken(req.headers["refresh_token"] as string);

  if (token) {
    res.json({ access_token: token });
  } else {
    res.status(400).json("Invalid token");
  }
});

router.get(
  "/profile",
  [authenticateToken, authorizeRoles("user","admin")],
  (req: Request, res: Response) => {
    res.json({ user: req.user });
  }
);

router.patch(
  "/promotion",
  [authenticateToken, authorizeRoles("admin")],
  async (req: Request, res: Response) => {
   const succeess= await promotionUser(req.body.id);
   if(succeess){
    res.json("User promoted successfully");
   }
   else{
    res.status(400).json("User not found to promote");
   }
  }
);

router.patch(
  "/approval",
  [authenticateToken, authorizeRoles("admin")],
  async (req: Request, res: Response) => {
 
   const result= await approveUser(req.body.id);
   if(result.success){
    res.json(result);
   }
   else{
    res.status(400).json(result);
   }
  }
);

router.get('/users', [authenticateToken, authorizeRoles("admin")], async (req: Request, res: Response) => {
  const users = await listUsers();
  res.json(users);

})

export default router;
