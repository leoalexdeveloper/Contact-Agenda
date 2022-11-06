const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const LoginSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: { type: String, required: true },
  password: { type: String, required: true }
})

const LoginModel = mongoose.model('User', LoginSchema)

class Login {
  constructor(body) {
    this.body = body
    this.errors = []
    this.user = null
  }

  async login() {
    this.body && this.validate()

    if (this.errors.length > 0) return

    const user = await LoginModel.findOne({ email: this.body.email })

    const match = bcrypt.compareSync(this.body.password, user.password)
    if (match) return user
  }

  async register() {
    this.body && this.validate()

    if (this.errors.length > 0) return

    this.userExists()

    if (this.errors.length > 0) return

    const salt = bcrypt.genSaltSync(Number(process.env.bcrypt_salt))
    const hash = bcrypt.hashSync(this.body.password, salt)
    this.body.password = hash
    const user = await LoginModel.create(this.body)
    return user
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email })
    if (user) this.errors.push('User already exists')
    return user
  }

  validate() {
    this.cleanUp()
    if (this.body.name && !validator.isAlphanumeric(this.body.name, [process.env.appLocale])) this.errors.push('Name must have only numbers and letters')
    if (!validator.isEmail(this.body.email)) this.errors.push('Invalid Email')
    if (!(this.body.password.length > 3 && this.body.password.length < 50)) this.errors.push('Password must be between 3 and 50 characters')
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

module.exports = Login
