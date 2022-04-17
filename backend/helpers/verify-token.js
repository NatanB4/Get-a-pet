const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

const checkToken = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Acesso negado" })
    }

    const token = getToken(req)

    if (!token) {
        return res.status(401).json({ message: "Acesso negado" })
    }

    try {

        const verifed = jwt.verify(token, 'secret')
        req.user = verifed
        next()

    } catch (error) {
        return res.status(400).json({ message: "Token invalido" })
    }
}

module.exports = checkToken