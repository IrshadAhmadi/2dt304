const mongoose = require('mongoose')

const CarDataSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Vehicle type (Truck, SUV, Sedan)
  height: { type: Number, required: true }, // Vehicle height in cm
  speed: { type: Number, required: false }, // Speed in km/h (optional)
  carCount: { type: Number, required: true }, // Total count of cars detected
  timestamp: { type: Date, default: Date.now } // Timestamp of the detection
})

module.exports = mongoose.model('CarData', CarDataSchema)
