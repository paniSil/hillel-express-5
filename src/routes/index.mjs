import { Router } from "express";
import rootRouter from "./root.mjs";
import usersRouter from "./users.mjs";
import articlesRouter from "./articles.mjs";
import themeRouter from "./theme.mjs";
import authRouter from "./auth.mjs";
import { ensureAuthenticated } from "../middleware/authHandler.mjs";


const router = Router()

router.use('/', rootRouter)
router.use('/theme', themeRouter)
router.use('/auth', authRouter);

router.use('/users', ensureAuthenticated, usersRouter)
router.use('/articles', ensureAuthenticated, articlesRouter)


export default router