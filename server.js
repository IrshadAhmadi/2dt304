const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const http = require('http')
// const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = require('./src/back/models/io').init(server)

// Database connection
mongoose.connect('mongodb://localhost:27017/test')
// mongoose.connect('mongodb+srv://naseem:Ali3017@cluster0.2o968rk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
// mongoose.connect('mongodb+srv://irshad:lnu123@cluster0.dyyivcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: false
}))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'front', 'views'))

io.on('connection', (socket) => {
  console.log('New client connected')
})

// Import the sensorRouter after the Socket.IO initialization
const sensorRouter = require('./src/back/routes/sensorRout')
app.use('/', sensorRouter)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)) // Use server.listen, not app.listen
