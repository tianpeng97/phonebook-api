const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: [true, 'name required'] },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'number required'],
    validate: {
      validator: (v) => /\d{2,3}-\d+/.test(v),
      message: (props) => `${props.value} not valid number`,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
