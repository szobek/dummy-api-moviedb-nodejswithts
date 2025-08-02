import { Router, Request, Response } from "express";
import { login, register, updateToken } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
    const registered=await register(req.body)
    
    if(registered?.success){
        res.json("User registered successfully")
    }
    else{
        res.status(400).json(registered)
        
    }
})


router.post('/login', async (req: Request, res: Response) => {
 const loggedIn=await login(req.body)
 if(loggedIn?.success){
    res.json(loggedIn)
 }
 else{
    res.status(400).json(loggedIn)
 }
});

router.put('/refresh-token', async (req: Request, res: Response) => {
  const token=await updateToken(req.headers["refresh_token"] as string )
  
  if(token){
    res.json({"access_token":token})
  }
  else{
    res.status(400).json("Invalid token")
  }
})

router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

export default router;