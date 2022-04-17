const Pet = require("../models/Pet")
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    static async create(req, res) {

        const { name, age, weight, color } = req.body

        const images = req.files

        const available = true

        //image upload

        //validation
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatorio" })
            return
        }
        if (!age) {
            res.status(422).json({ message: "Os anos é obrigatorio" })
            return
        }
        if (!weight) {
            res.status(422).json({ message: "O Tamanho é obrigatorio" })
            return
        }
        if (!color) {
            res.status(422).json({ message: "A cor é obrigatorio" })
            return
        }

        if (images.length == 0) {
            res.status(422).json({ message: "A imagem é obrigatorio" })
            return
        }


        //get pet onwer
        const token = getToken(req)
        const user = await getUserByToken(token)


        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {

            const newPet = await pet.save()
            res.status(201).json({
                message: "Pet cadastrado com sucesso",
                newPet
            })

        } catch (err) {
            res.status(500).json({ message: err })
        }
        res.json({ message: "right!" })
    }

    static async getAll(req, res) {

        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({
            pets: pets,

        })
    }

    static async getAllUserPets(req, res) {

        // get user from token
        const token = getToken(req)
        const user = getUserByToken(token)

        const pets = await Pet.find({ 'user._id:': user._id }).sort('-createdAt')

        res.status(200).json({
            pets,
        })
    }


    static async getAllUserAdoptions(req, res) {

        // get user from token
        const token = getToken(req)
        const user = getUserByToken(token)

        const pets = await Pet.find({ 'adopter._id:': user._id }).sort('-createdAt')

        res.status(200).json({
            pets
        })
    }

    static async getPetById(req, res) {

        const id = req.params.id


        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID invâlido!" })
            return
        }

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: "O pet não existe" })
            return
        }

        res.status(200).json({ pet })

    }


    static async removePetById(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "ID invâlido!" })
            return
        }

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: "O pet não existe" })
            return
        }

        // check if logged in user registesred the pet

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: "Houve um problema em processar sua solicitação tente novamente mais tarde" })
            return
        }

        await Pet.findByIdAndRemove(id)
        res.status(200).json({ message: "Deletado com sucesso" })
    }

    static async uptade(req, res) {

        const id = req.params.id;

        const { name, age, weight, color, available } = req.body

        const images = req.files

        const uptadeData = {}

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: "O pet não existe" })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: "Houve um problema em processar sua solicitação tente novamente mais tarde" })
            return
        }
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatorio" })
            return
        } else {
            uptadeData.name = name
        }
        if (!age) {
            res.status(422).json({ message: "Os anos é obrigatorio" })
            return
        } else {
            uptadeData.age = age
        }
        if (!weight) {
            res.status(422).json({ message: "O Tamanho é obrigatorio" })
            return
        } else {
            uptadeData.weight = weight
        }
        if (!color) {
            res.status(422).json({ message: "A cor é obrigatorio" })
            return
        } else {
            uptadeData.color = color
        }

        if (images.length == 0) {
            res.status(422).json({ message: "A imagem é obrigatorio" })
            return
        } else {
            uptadeData.images = []
            images.map(image => {
                uptadeData.images.push(images.filename)
            })
        }


        await Pet.findByIdAndUpdate(id, uptadeData)

        res.status(200).json({ message: "pet atualizado com sucesso" })
    }

    static async schedule(req, res) {
        const id = req.params.id

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: "O pet não existe" })
            return
        }


        if (pet.user._id.toString() === user._id.toString()) {
            res.status(422).json({ message: "Você não pode agendar uma visita com seu proprio pet!" })
            return
        }

        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                res.status(422).json({ message: "Você já agendou uma visita com este pet" })
                return
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: `A visita foi agendado com sucesso ${pet.user.name} pelo telefone ${pet.user.phone}` })
    }

    static async concludeAdoption(req, res) {

        const id = req.params.id

        const pet = await Pet.findOne({ _id: id })

        if (!pet) {
            res.status(404).json({ message: "O pet não existe" })
            return
        }

        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: "Houve um problema em processar sua solicitação tente novamente mais tarde" })
            return
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({ message: "Parabéns o ciclo de adoção foi finalizado com sucesso" })
    }
}