const Login = require('../models/loginModel')

module.exports.index = (req, res) => {
  res.render('login')
}

module.exports.login = async (req, res) => {
  const login = new Login(req.body)
  const user = await login.login()

  if (login.errors.length > 0) {
    req.flash('errors', login.errors)
    req.session.save(() => {
      res.redirect('/login/index')
    })
    return
  }
  req.flash('success', 'Usuário logado com successo')
  req.session.user = user
  req.session.save(() => res.redirect('/'))
}

module.exports.register = async (req, res) => {
  const login = new Login(req.body)
  await login.register()

  if (login.errors.length > 0) {
    req.flash('errors', login.errors)
    req.session.save(() => {
      res.redirect('/login/index')
    })
    return
  }

  req.flash('success', 'Usuário criado com successo')
  req.session.save(() => res.redirect('/login/index'))
}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.redirect('/login/index')
}
