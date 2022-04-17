const express = require('express')
const app = express()
const cors = require('cors')

// config json parse
app.use(express.json())

// Solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// Public folder for images
app.use(express.static('public'))

//Routes
const UserRoutes = require('./routes/UserRoutes.js')
const PetsRoutes = require('./routes/PetRoutes.js')

app.use('/users', UserRoutes)
app.use('/pets', PetsRoutes)
app.listen(5000)