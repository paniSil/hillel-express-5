import { Router } from "express";
import rootRouter from "./root.mjs";
import usersRouter from "./users.mjs";
import articlesRouter from "./articles.mjs";
import themeRouter from "./theme.mjs";
import authRouter from "./auth.mjs";

import { protect, authorize } from "../middleware/authHandler.mjs";


const router = Router();

router.use('/', rootRouter);
router.use('/theme', themeRouter);
router.use('/auth', authRouter);

router.use('/users', protect, usersRouter);
router.use('/articles', protect, authorize('admin'), articlesRouter);


export default router;