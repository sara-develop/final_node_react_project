const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/user")
const { isValidId } = require('../utils')

const login = async (req, res) => {
    const { id, password } = req.body

    if (!id || !password) {
        return res.status(400).json({ message: 'ID and password are required' })
    }

    const foundUser = await User.findOne({ id }).lean()
    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const userInfo = {
        _id: foundUser._id,
        name: foundUser.name,
        role: foundUser.role
    }

    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)

    return res.status(200).json({ accessToken })
}

const register = async (req, res) => {
    const { name, id, password } = req.body
    const role = id === process.env.MANAGER_ID ? 'principal' : 'secretary'

    if (!name || !id || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!isValidId(id)) {
        return res.status(400).json({ message: 'Invalid ID format' })
    }

    const duplicate = await User.findOne({ id }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "User with this ID already exists" })
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { name, id, password: hashedPwd, role }

    try {
        const user = await User.create(userObject)
        return res.status(201).json({ message: `New user ${user.name} created` })
    } catch (err) {
        return res.status(500).json({ message: 'User creation failed', error: err })
    }
}

module.exports = { login, register }
