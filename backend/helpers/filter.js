const User = require('../models/User')
const bcrypt = require('bcrypt')

async function RegisterFilter(req, res, name, email, phone, password, confirmpassword, info) {

    if (info) {
        if (!name || !email || !phone || !password || !confirmpassword) {
            let resposta = [];

            !name ? resposta.push('nome') : '';
            !email ? resposta.push(' email') : '';
            !phone ? resposta.push(' telefone') : '';
            !password ? resposta.push(' senha') : '';
            !confirmpassword ? resposta.push(' confirmar senha') : '';

            res.status(422).json({ message: `O campo ${resposta} é obrigatorio` })
            return false
        } else if (password != confirmpassword) {
            res.status(422).json({ message: `As senhas não são iguais` })
            return false
        }
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            res.status(422).json({ message: `Usuario já cadastrado` })
            return false
        }
    } else {
        if (!name || !email || !phone) {
            let resposta = [];

            !name ? resposta.push('nome') : '';
            !email ? resposta.push(' email') : '';
            !phone ? resposta.push(' telefone') : '';

            res.status(422).json({ message: `O campo ${resposta} é obrigatorio` })
            return false
        }
        if (password != confirmpassword) {
            res.status(422).json({ message: `As senhas não são iguais` })
            return false
        }
    }


    return true
}

async function LoginFilter(req, res, email, password) {
    if (!email || !password) {
        let resposta = [];

        !email ? resposta.push(' email') : '';
        !password ? resposta.push(' senha') : '';

        res.status(422).json({ message: `O campo ${resposta} é obrigatorio` })
        return false
    }

    //check if user exists
    const user = await User.findOne({ email: email })

    if (!user) {
        res.status(422).json({ message: `Usuario não existe` })
        return false
    }

    //check if password match with db password

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        res.status(200).json({ message: `Senha incorreta` })
        return false
    }

    return user
}

module.exports = { RegisterFilter, LoginFilter }