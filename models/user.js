const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'Username required.'] },
  name: { type: String, required: [true, 'Name required.'] },
  passwordHash: String,
  phonebookEntries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  },
})

module.exports = mongoose.model('User', userSchema)
