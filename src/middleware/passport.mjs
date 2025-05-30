import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUserByEmail, comparePasswords, findUserById } from '../data/users.mjs';

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        const user = await findUserByEmail(email);
        if (!user) return done(null, false, { message: 'User not found' });
        const isValid = await comparePasswords(password, user.password);
        if (!isValid) return done(null, false, { message: 'Wrong password' });
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id);
    done(null, user);
});