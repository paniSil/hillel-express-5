import express from 'express'
import router from './routes/index.mjs'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.mjs'
import { logRequests } from './middleware/logRequests.mjs'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import './middleware/passport.mjs';
import flash from 'connect-flash';



const app = express()
const PORT = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static('public'))
app.set('views', './src/views')
app.set('view engine', 'pug')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(session({
    secret: 'secretsession',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/set-cookie', (req, res) => {
    res.cookie('user', 'john_doe', { maxAge: 900000, httpOnly: true })
    res.send('Cookie встановлено')
})
app.get('/get-cookie', (req, res) => {
    const cookieValue = req.cookies.user
    res.send(`Значення cookie: ${cookieValue}`)
})

app.use(logRequests)
app.use(router)
app.use(notFoundHandler)
app.use(errorHandler)

const server = app.listen(PORT, () => {
    console.log(`Сервер запущений за адресою http://localhost:${PORT}`)
})

export { server, app };
