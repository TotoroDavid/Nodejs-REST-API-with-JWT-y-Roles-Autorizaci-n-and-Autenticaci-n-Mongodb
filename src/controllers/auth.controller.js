import User from '../models/User'
import Role from '../models/Role'
import jwt from 'jsonwebtoken'
import config from '../config'
import { json } from 'express'

export const signUp = async(req, res) => {
        const { username, email, password, roles } = req.body
        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password)
        })
        if (req.body.roles) {
            const foundRoles = await Role.find({ name: { $in: roles } })
            newUser.roles = foundRoles.map((role) => role._id)
        } else {
            const role = await Role.findOne({ name: "user" })
            newUser.roles = [role._id]
        }

        const savedUser = await newUser.save()
        console.log(savedUser)
        const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
            expiresIn: 86400 // 24 horas
        })
        res.status(200).json({ token })
    }
    //signIn
export const signIn = async(req, res) => {
    const userFound = await User.findOne({ email: req.body.email }).populate('roles')
    if (!userFound) return res.status(404).json({ message: 'User not found' })
    const matchPassword = await User.comparePassword(req.body.password, userFound.password)
    if (!matchPassword) return res.status(404).json({ token: null, message: 'invalid password' })
    const token = jwt.sign({ id: userFound._id }, config.SECRET, {
        expiresIn: 86400
    })
    res.json({ token })
}

export default signUp