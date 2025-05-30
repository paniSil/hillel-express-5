const getRootHandler = (req, res) => {
    const text = 'This is example of using PUG and EJS for page render'
    const theme = req.cookies.theme || 'light';
    res.render('index.pug', { text, theme: theme })
    //res.end('Get root route')
}

export { getRootHandler }