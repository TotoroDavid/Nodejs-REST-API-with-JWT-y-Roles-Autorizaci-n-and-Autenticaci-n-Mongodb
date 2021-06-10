import jwt from 'jsonwebtoken'
import config from '../config'
import User from '../models/User'
import Role from '../models/Role'

export const verifyToken = async(req, res, next) => {
    try {
        const token = req.headers[
            'x-access-token'
        ]
        console.log(token)
        if (!token) return res.status(403).json({ message: 'no token provided' })
        const decoded = jwt.verify(token, config.SECRET)
        req.userId = decoded.id
        const user = await User.findById(req.userId, { password: 0 })
        console.log(user)
        if (!user) return res.status(404).json({ message: 'no user found' })
        next()
    } catch (error) {
        return res.status(404).json({ message: 'unauthorized' })
    }
}

export const isModerator = async(req, res, next) => {
    const user = await User.findById(req.userId)
    const roles = await Role.find({ _id: { $in: user.roles } })
    console.log(roles)

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
            next()
            return
        }
    }
    return res.status(403).json({ message: 'requer moderator role' })
}

export const isAdmin = async(req, res, next) => {
    const user = await User.findById(req.userId)
    const roles = await Role.find({ _id: { $in: user.roles } })
    console.log(roles)

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
            next()
            return
        }
    }
    return res.status(403).json({ message: 'requer admin role' })
}