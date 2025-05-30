import { Router } from 'express'
import {
    getArticlesHandler,
    postArticlesHandler,
    getArticleByIdHandler,
    putArticleByIdHandler,
    deleteArticleByIdHandler
} from '../controllers/articles.mjs'

import { validateArticleBody, validateParamsArticleId } from '../validators/articleValidation.mjs'


const articlesRouter = Router()

articlesRouter
    .route('/')
    .get(getArticlesHandler)
    .post(validateArticleBody, postArticlesHandler)

articlesRouter
    .route('/:id')
    .get(validateParamsArticleId, getArticleByIdHandler)
    .put(validateParamsArticleId, validateArticleBody, putArticleByIdHandler)
    .delete(validateParamsArticleId, deleteArticleByIdHandler)

export default articlesRouter