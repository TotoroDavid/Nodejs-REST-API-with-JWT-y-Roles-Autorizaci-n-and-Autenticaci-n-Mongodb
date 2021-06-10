import { Router } from 'express'
const router = Router()

import * as userCtrl from '../controllers/user.controler'
import { authJwt, verifySignup } from '../middlewares'

router.post('/', [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignup.checkRolesExisted
], userCtrl.createUser)

export default router