import { Router, Request, Response } from "express";
import runSeed from "../controllers/seed.controller";

const router = Router();

router.get("", async (req: Request, res: Response) => {
  const data = await runSeed();
  if(data){
    res.json("Seed run successfully")
  }
  else{
    res.json("Seed run failed")
  }
});

export default router;