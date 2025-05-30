import { Joi, celebrate, Segments } from "celebrate"

const articleSchema = Joi.object({
    title: Joi.string().required().min(3).max(30),
    text: Joi.string().required().min(3),
})

const validateArticleBody = celebrate({
    [Segments.BODY]: articleSchema
})

const validateParamsArticleId = celebrate({
    [Segments.PARAMS]: Joi.object({
        id: Joi.string().required()
    })
})

export { validateArticleBody, validateParamsArticleId }

// export const validateArticleInput = (req, res, next) => {
//     const { title } = req.body
//     if (!title || title.trim() === '') {
//         return res.status(400).send('Bad Request: Article title is required and cannot be empty.')
//     }
//     next()
// }
