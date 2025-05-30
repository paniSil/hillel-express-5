import express from 'express';
import passport from 'passport';
import { createUser, findUserByEmail, users } from '../data/users.mjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

const authRouter = express.Router();

authRouter.get('/login', (req, res) => {
    const errorMessage = req.flash('error');
    res.render('auth/login', {
        title: 'Вхід',
        theme: req.cookies.theme || 'light',
        errorMessage: errorMessage.length ? errorMessage[0] : null
    });
});


authRouter.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })
);

authRouter.get('/register', (req, res) => {
    res.render('auth/register', {
        title: 'Реєстрація',
        theme: req.cookies.theme || 'light'
    });
});

authRouter.post('/register', async (req, res) => {
    const { name, email, password, age } = req.body;

    if (!name || !email || !password || !age) {
        return res.status(400).send('Всі поля обов\'язкові для реєстрації.');
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(409).send('Користувач з таким email вже зареєстрований.');
    }

    try {
        const newUser = await createUser(name, email, password, age);

        req.login(newUser, (err) => {
            if (err) {
                console.error('Помилка автоматичного логіну після реєстрації:', err);
                return res.status(500).send('Помилка автоматичного логіну.');
            }
            res.redirect('/');
        });
    } catch (error) {
        console.error('Помилка реєстрації користувача:', error);
        res.status(500).send('Помилка при реєстрації користувача.');
    }
});

authRouter.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});

authRouter.get('/forgot', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('auth/forgot', { theme });
});

authRouter.post('/forgot', async (req, res) => {
    const { email } = req.body;
    const user = findUserByEmail(email);
    const theme = req.cookies.theme || 'light';

    if (!user) {
        return res.render('auth/forgot', { message: 'Користувача з таким Email не знайдено.', theme });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // Токен дійсний 1 годину

    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    const resetLink = `http://localhost:3000/auth/reset/${token}`;

    const info = await transporter.sendMail({
        to: user.email,
        subject: 'Скидання пароля для вашого акаунта',
        html: `<p>Ви запросили скидання пароля. Будь ласка, перейдіть за цим посиланням, щоб скинути пароль:</p>
               <a href="${resetLink}">${resetLink}</a>
               <p>Посилання дійсне протягом 1 години.</p>`
    });

    console.log('Попередній перегляд Ethereal Email: ' + nodemailer.getTestMessageUrl(info));
    res.render('auth/forgot', { message: 'Перевірте ваш Email для отримання посилання на скидання пароля.', theme });
});

authRouter.get('/reset/:token', (req, res) => {
    const { token } = req.params;
    const theme = req.cookies.theme || 'light';

    const user = users.find(u => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > Date.now());

    if (!user) {
        return res.render('auth/reset', { message: 'Посилання для скидання пароля недійсне або термін його дії закінчився.', theme, token: null });
    }

    res.render('auth/reset', { token: token, theme, message: null });
});

authRouter.post('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const theme = req.cookies.theme || 'light';

    const user = users.find(u => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > Date.now());

    if (!user) {
        return res.render('auth/reset', { message: 'Посилання для скидання пароля недійсне або термін його дії закінчився.', theme, token: null });
    }

    if (!password || password.length < 6) {
        return res.render('auth/reset', { message: 'Пароль повинен бути не менше 6 символів.', theme, token });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    res.redirect('/auth/login');
});

export default authRouter;