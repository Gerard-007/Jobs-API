const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnAuthenticatedError} = require('../errors')


async function register(req, res) {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        throw new BadRequestError("please provide email and password")
    }
    const user = await User.findOne({ email })
    if(!user) {
        throw new UnAuthenticatedError("email or password did not match")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        throw new UnAuthenticatedError("email or password did not match")
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).send({user: {name: user.name}, token });
}

module.exports = {
    register,
    login
}