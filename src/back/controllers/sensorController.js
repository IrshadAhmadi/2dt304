const CarData = require('../models/carData')
const io = require('../models/io').getIO()

exports.viewCarData = async (req, res) => {
  try {
    const carData = await CarData.find({})
    console.log(carData)
    res.render('sensorData', { carData })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error loading car data')
  }
}

exports.addCarData = async (req, res) => {
  try {
    const { type, height, speed, carCount } = req.body
    if (!type || height === undefined) {
      return res.status(400).send('Missing type or height in the request body.')
    }
    const speedData = speed !== undefined ? speed : 'Speed not detected'

    const newCarData = new CarData({
      type,
      height,
      speed: speedData,
      carCount
    })

    const savedCarData = await newCarData.save()
    io.emit('carData', savedCarData)
    res.status(201).send('Car data added successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send('Error saving car data')
  }
}
