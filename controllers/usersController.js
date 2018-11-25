const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function signUp (req, res) {
  const newUser = {
    email: req.body.email,
    password: req.body.password
  }

  User.create(newUser, (err, newUser) => {
    if (err) {
      if (err.code === 11000) {
        res.json({ success: false, err: 'Email has already been registered before' })
      } else {
        res.json({ success: false, err: 'Failed to register' })
      }
    } else {
      res.json({ success: true })
    }
  })
}

function login (req, res) {
  const email = req.body.email
  const password = req.body.password
  const query = { email }

  User.findOne(query, (err, foundUser) => {
    if (err || !foundUser) {
      res.json({ success: false, err: 'User does not exist' })
    } else {
      const payload = {
        _id: foundUser.toJSON()._id
      }
      bcrypt.compare(password, foundUser.password, (err, isMatch) => {
        if (err) throw err
        if (!isMatch) {
          res.json({ success: false, err: 'Password is wrong' })
        } else {
          const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: 604800
          })

          res.json({
            success: true,
            token: 'JWT ' + token,
            foundUser: { ...foundUser.toJSON(), ...{ password: undefined } }
          })
        }
      })
    }
  })
}

function editUser (req, res) {
  const token = req.headers.authorization.slice(4)
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) throw err
    else if (decoded._id !== req.params.id) {
      res.json({ success: false, err: 'Logged in but not authorised to edit this user' })
    } else {
      User.findById(decoded._id, (err, foundUser) => {
        if (err || !foundUser) {
          res.json({ success: false, err: 'User not found' })
        } else {
          foundUser.password = req.body.password
          foundUser.save((err, product) => {
            if (err) {
              console.log(err)
              res.json({ success: false, err: 'User not updated' })
            } else {
              res.json({ success: true })
            }
          })
        }
      })
    }
  })
}

module.exports = {
  signUp,
  login,
  editUser,
}
