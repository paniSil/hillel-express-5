const VALID_ARTICLE_ID = '456';
const articles = [
    { id: '123', title: 'Awesome Article', text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis dui a purus condimentum facilisis eget et nunc. Morbi egestas viverra massa sed accumsan. Aliquam tempus neque magna, et interdum quam molestie id. Cras mollis metus purus, vitae porttitor nibh interdum vitae." },
    { id: '456', title: 'Oh Some Article', text: "Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque efficitur fringilla rutrum." }
]

const getArticlesHandler = (req, res) => {
    // res.end('Get articles route')
    const title = 'Article list (EJS)'
    const theme = req.cookies.theme || 'light';
    res.render('articles.ejs', { title: title, articles: articles, theme: theme, user: req.user })
}

const postArticlesHandler = (req, res) => {
    const { title, text } = req.body;
    const newArticle = { id: (articles.length + 1).toString(), title, text };

    if (newArticle && newArticle.title) {
        articles.push(newArticle);
        res.status(201).send('Article created')
    } else {
        res.status(400).send('Bad Request')
    }
}

const getArticleByIdHandler = (req, res) => {
    const theme = req.cookies.theme || 'light';
    const articleId = req.params.id;
    const article = articles.find(u => u.id === articleId);

    if (article) {
        res.render('article.ejs', { article: article, theme: theme, user: req.user })
    } else {
        res.status(404).send('Article Not Found')
    }
}

const putArticleByIdHandler = (req, res) => {
    const articleId = req.params.id;
    const { title, text } = req.body;
    const articleIndex = articles.findIndex(a => a.id === articleId);

    if (articleIndex !== -1) {
        if (!title && !text) {
            return res.status(400).json({ message: 'No data provided for update.' });
        }
        articles[articleIndex] = {
            ...articles[articleIndex],
            ...(title && { title }),
            ...(text && { text })
        };
        res.status(200).json({ message: `Article ${articleId} updated successfully!`, article: articles[articleIndex] });
    } else {
        res.status(404).send('Article Not Found')
    }
}

const deleteArticleByIdHandler = (req, res) => {
    const articleId = req.params.id;
    const initialLength = articles.length;
    articles = articles.filter(a => a.id !== articleId);

    if (articles.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Article Not Found' });
    }
}

export { getArticlesHandler, postArticlesHandler, getArticleByIdHandler, putArticleByIdHandler, deleteArticleByIdHandler }