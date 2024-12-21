import { Router } from "express";
const router = Router();

//routes

router.get("/", (req, res) => res.render('musicapp', {title: 'MusicApp'}));



export default router;
