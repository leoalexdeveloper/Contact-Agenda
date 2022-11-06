module.exports.msgs = (req, res, next) => {
  res.locals.errors = req.flash('errors')
  res.locals.success = req.flash('success')
  res.locals.user = req.session.user
  next()
}

module.exports.userRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'Um should be logged to access this page')
    req.session.save(() => res.redirect('/login/index'))
    return
  }
  next()
}

module.exports.generateCsrfToken = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
}

module.exports.csrfError = (err, req, res, next) => {
  if(err && err.code === 'EBADCSRFTOKEN'){
    res.redirect('/')
    return
  }
  next()
}
