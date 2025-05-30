const THEMES = ['light', 'dark']

export const setThemeHandler = (req, res) => {
    const { theme } = req.body;

    if (!theme) {
        return res.status(400).json({ message: 'Theme is required.' });
    }

    if (!THEMES.includes(theme)) {
        return res.status(400).json({ message: `Invalid theme: ${theme}. Valid themes are: ${THEMES.join(', ')}.` });

    }
    res.cookie('theme', theme, { httpOnly: true });
    res.redirect('/theme')
}

export const getThemeHandler = (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('theme.pug', { theme: theme });
};