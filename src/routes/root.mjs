import { Router } from 'express'
import { getRootHandler } from '../controllers/root.mjs'

const rootRouter = Router()

rootRouter.get('/', getRootHandler)

export default rootRouter