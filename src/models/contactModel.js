const mongoose = require('mongoose')
const validator = require('validator')

const ContactSchema = mongoose.Schema({
  name: { type: String, required: true },
  secondname: { type: String, require: true },
  email: { type: String, required: true },
  telefone: { type: String, required: true },
  createdAt: { type: Date, default: new Date },
  createdBy: { type: String, required: true }
})

const ContactModel = mongoose.model('contact', ContactSchema)

class Contact {
  constructor(body) {
    this.body = body
    this.errors = []
  }

  async register(userEmail) {
    this.validate()

    if (this.errors.length > 0) return

    await this.userExists()

    if (this.errors.length > 0) return
    this.body.createdBy = userEmail
    const user = await ContactModel.create(this.body)
    return user
  }

  static async edit(id) {
    const contact = await ContactModel.findById(id)
    return contact
  }

  async edit_store(id) {
    this.validate()
    if (this.errors.length > 0) return
    await this.emailExistsOnDB(id)
    if (this.errors.length > 0) return
    await ContactModel.findByIdAndUpdate(id, this.body, { new: true })
  }

  static async delete(id) {
    const contact = await ContactModel.findOneAndDelete({ _id: id })
    return (contact) ? contact : null
  }

  static async find_contacts(userEmail) {
    const contacts = await ContactModel.find({ createdBy: userEmail }).sort({ createdAt: -1 })
    return (contacts) ? contacts : null
  }

  async userExists() {
    const user = await ContactModel.findOne({ email: this.body.email })
    if (user) this.errors.push('This user already exists')
  }

  async emailExistsOnDB(id) {
    const hasEmailOnDB = await ContactModel.findOne({ email: this.body.email })
    if (String(id) !== String(hasEmailOnDB._id).replace('new ObjectId(', '').replaceAll('"', '')) this.errors.push('This email is already registered')
  }

  async validate() {
    this.cleanUp()
    if (validator.isEmpty(this.body.name)) this.errors.push('Name is a required field')
    if (validator.isEmpty(this.body.secondname)) this.errors.push('Second Name is a required field')
    if (validator.isEmpty(this.body.email)) this.errors.push('Email is a required field')
    if (!validator.isEmpty(this.body.email) && !validator.isEmail(this.body.email)) this.errors.push('Email should be a valid email address')
    if (validator.isEmpty(this.body.telefone)) this.errors.push('Telephone is a required field')
    if (!validator.isEmpty(this.body.telefone) && this.body.telefone.length < 10) this.errors.push('Telefone should be a valid number')
  }

  cleanUp() {
    const fields = Object.keys(this.body)
    for (let i = 0; i < fields.length; i++) {
      if (typeof this.body[fields[i]] !== 'string') {
        this.body[fields[i]] = ''
      }
    }
  }
}

module.exports = Contact
