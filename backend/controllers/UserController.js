const jwt = require('jsonwebtoken')
const User = require('../models/User')

const filter = require('../helpers/filter')
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

const bcrypt = require('bcrypt')

module.exports = class UserController {

    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body
        if (!name || !email || !phone || !password || !confirmpassword) {
            let resposta = [];

            !name ? resposta.push('nome') : '';
            !email ? resposta.push(' email') : '';
            !phone ? resposta.push(' telefone') : '';
            !password ? resposta.push(' senha') : '';
            !confirmpassword ? resposta.push(' confirmar senha') : '';

            return res.status(422).json({ message: `O campo ${resposta} é obrigatorio` })
        } else if (password != confirmpassword) {
            return res.status(422).json({ message: `As senhas não são iguais` })
        }
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            return res.status(422).json({ message: `Usuario já cadastrado` })
        }else {
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
    
            // create a user
            const user = new User({
                name,
                email,
                phone,
                password: passwordHash
            })
    
            try {
                const newUser = await user.save()
    
                await createUserToken(newUser, req, res)
            } catch (err) {
                res.status(500).json({ message: err })
            }
        }

    }

    static async login(req, res) {

        const { email, password } = req.body
        const UserLogin = await filter.LoginFilter(req, res, email, password)

        if (UserLogin) {
            createUserToken(UserLogin, req, res)
        }
    }

    static async checkUser(req, res) {
        let currentUser = ''

        if (req.headers.authorization) {

            const token = getToken(req)

            const decoded = jwt.verify(token, "secret")

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if (!user) {
            res.status(422).json({ message: "Usuario não encontrado" })
            return
        }

        res.status(200).json({ user })

    }

    static async editUser(req, res) {
        const id = req.params.id

        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body

        if (req.file) {
            user.image = req.file.filename
        }


        //validations
        await filter.RegisterFilter(req, res, name, email, phone, password, confirmpassword)

        if (user.email !== email && user) {
            res.status(422).json({
                message: "Por favor utilize outro email"
            })
            return
        }

        user.phone = phone

        if (password && confirmpassword && password != null) {

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {

            await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true })

            res.status(200).json({ message: "Usuário editado com sucesso!" })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

}