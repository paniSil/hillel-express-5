import { Router } from 'express';
import { setThemeHandler, getThemeHandler } from '../controllers/theme.mjs';

const themeRouter = Router();

themeRouter.get('/', getThemeHandler);
themeRouter.post('/', setThemeHandler);

export default themeRouter;