export function protect(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('error', 'Будь ласка, увійдіть, щоб отримати доступ.');
    res.redirect('/auth/login');
}

export const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Неавторизований доступ. Користувач не визначений.' });
        }

        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Відмовлено у доступі. Недостатньо прав.' });
        }
        next();
    };
};
