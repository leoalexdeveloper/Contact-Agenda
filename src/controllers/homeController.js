const Contact = require('../models/contactModel')

module.exports.index = async (req, res) => {
  const contacts = await Contact.find_contacts(req.session.user.email)
  if (!contacts) {
    req.flash('errors', 'Cannot loading the contacts')
    res.render('index')
  }
  res.render('index', { contacts })
}