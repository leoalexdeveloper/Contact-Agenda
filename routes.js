/* imports */
const express = require('express')
const router = express.Router()

/* controllers */
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contactController = require('./src/controllers/contactController')

/* middlewares */
const { userRequired } = require('./src/middlewares/globalMiddlewares')

/* routes */
/* index  */
router.get('/', userRequired, homeController.index)

/* login  */
router.get('/login/index', loginController.index)
router.post('/login/register', loginController.register)
router.post('/login/login', loginController.login)
router.get('/login/logout', userRequired, loginController.logout)

/* contact */
router.get('/contact/index', userRequired, contactController.index)
router.post('/contact/register', userRequired, contactController.register)
router.get('/contact/edit/:id', userRequired, contactController.edit)
router.post('/contact/edit/:id', userRequired, contactController.edit_store)
router.get('/contact/delete/:id', userRequired, contactController.delete)

/* exports */
module.exports = router
