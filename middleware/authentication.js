const jwt = require('jsonwebtoken')
const {UnAuthenticatedError} =  require('../errors')
const User = require('../models/User')


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnAuthenticatedError("Authentication invalid")
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId: payload.userId, name: payload.name}
        // OR Get the user from database
        // req.user = User.findById(payload.id).select('-password')
        next()
    } catch (error) {
        console.log(error)
        throw new UnAuthenticatedError("Authentication invalid")
    }
}

module.exports = auth