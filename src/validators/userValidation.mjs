import { Joi, celebrate, Segments } from "celebrate"

const userSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    age: Joi.number().required().min(0).max(110)
})

const validateUserBody = celebrate({
    [Segments.BODY]: userSchema
})

const validateParamsUserId = celebrate({
    [Segments.PARAMS]: Joi.object({
        id: Joi.string().required()
    })
})

// const validateUserInput = (req, res, next) => {
//     const { name } = req.body
//     if (!name || name.trim() === '') {
//         return res.status(400).send('Bad Request: User name is required and cannot be empty.')
//     }
//     next()
// }

export { validateUserBody, validateParamsUserId }
