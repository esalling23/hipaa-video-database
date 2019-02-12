const keystone = require('keystone')
const User = keystone.list('User')
const _ = require('underscore')

// Signup
exports.create = function (req, res) {
  User.model.find().exec().then(result => {
    const id = result.length

    const newUser = new User.model({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password
    })

    if (req.body.isResearcher) newUser.isResearcher = true
    else newUser.clientId = 'client_' + id

    newUser.save(function (err, result) {
      if (err) res.error(err)
      console.log(result)
      const data = {
        user: result,
        url: '/client/' + result.id
      }
      res.send(data)
    })
  })
}

// Login
exports.get = function (req, res) {
  console.log(req.body.data)
  const body = req.body.data ? req.body.data : req.body
  User.model.find()
    .then(list => {
      const user = _.findWhere(list, {
        email: body.email
      })
      if (!user) {
        return res.send({
          error: 'no_profile',
          msg: 'No profile for that email'
        })
      }
      console.log(typeof body.password, typeof user.password) // returns 'string', 'string'
      console.log(body.password === user.password) // returns true

      user._.password.compare(body.password, (err, result) => {
        // console.log(err, result)
        if (result) {
          const data = {
            user: user
          }

          if (user.isAdmin) data.url = '/researcher/' + user.id
          else data.url = '/client/' + user.id

          if (!user.clientId && !user.isAdmin && !user.isResearcher) user.clientId = 'client_' + list.length

          user.save(function (err, result) {
            if (err) res.error(err)
            res.send(data)
          })
        } else if (!result || err) {
          console.log('wrong password')
          res.send({
            error: 'wrong_password',
            msg: 'Sorry, wrong password'
          })
        }
      })
    }).catch(console.error)
}
