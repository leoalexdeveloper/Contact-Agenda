const Contact = require('../models/contactModel')

module.exports.index = (req, res) => {
  res.render('contact', { contact: {} })
}

module.exports.register = async (req, res) => {
  if (!req.body) return res.render('404')

  try {
    const contact = new Contact(req.body)
    console.log(req.session.user)
    await contact.register(req.session.user.email)

    if (contact.errors.length > 0) {
      req.flash('errors', contact.errors)
      req.session.save(() => res.redirect('/contact/index'))
      return
    }

    req.flash('success', 'User added successfully')
    req.session.save(() => res.redirect('/'))
  } catch (e) {
    console.log(e)
    req.flash('errors', 'Something went wrong register')
    req.session.save(() => res.redirect('/contact/index'))
  }
}

module.exports.edit = async (req, res) => {
  console.log(req.params.id)
  if (!req.params.id) return res.render('404')

  try {
    const contact = await Contact.edit(req.params.id)

    if (contact) res.render('contact', { contact: contact })
  } catch (e) {
    console.log(e)
    req.flash('errors', 'Something went wrong edit')
    req.session.save(() => res.redirect('/contact/index'))
  }
}

module.exports.edit_store = async (req, res) => {
  if (!req.params.id) return res.render('404')

  try {
    const contact = new Contact(req.body)
    await contact.edit_store(req.params.id)
    console.log(contact.errors)
    if (contact.errors.length > 0) {
      req.flash('errors', contact.errors)
      req.session.save(() => res.redirect(`/contact/edit/${req.params.id}`))
      return
    }

    req.flash('success', `User ${req.body.name} edited successfully`)
    req.session.save(() => res.redirect('/'))
  } catch (e) {
    console.log(e)
    req.flash('errors', 'Something went wrong')
    req.session.save(() => res.redirect('/contact/index'))
  }
}

module.exports.delete = async (req, res) => {
  try {
    await Contact.delete(req.params.id)
    req.flash('success', 'Contact deleted successfully')
    req.session.save(() => res.redirect('/'))

  } catch (e) {
    console.log(e)
    req.flash('errors', 'Something went wrong')
    req.session.save(() => res.redirect('/'))
  }

}
