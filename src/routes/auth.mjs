import express from 'express';
import passport from 'passport';
import { register, logout, getForgotPage, postForgot, getResetPage, postReset } from '../controllers/auth.mjs';

const router = express.Router();

router.get('/login', (req, res) => res.render('auth/login.pug'));
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/register', (req, res) => res.render('auth/register.pug'));
router.post('/register', register);

router.get('/logout', logout);
router.post('/logout', logout);

router.get('/forgot', getForgotPage);
router.post('/forgot', postForgot);
router.get('/reset/:token', getResetPage);
router.post('/reset/:token', postReset);

export default router;