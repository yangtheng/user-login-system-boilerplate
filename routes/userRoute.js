const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const passport = require('passport')

router.post('/', usersController.signUp)

router.post('/login', usersController.login)

router.patch('/:id', passport.authenticate('jwt', { session: false }), usersController.editUser)

module.exports = router
