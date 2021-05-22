const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { reset } = require('nodemon')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler') 

module.exports.login = function(req, res) { }

module.exports.register = async function(req, res) {
    // email password
   const candidate = await User.findOne({ email: req.body.email})

   if (candidate)  {
       res.status(409).json({
           message:'Try another email'
       })
   } else {
       const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
       const user = new User({
           email: req.body.email,
           password: bcrypt.hashSync(password, salt) 
       })

       try {
        await user.save()
        res.status(201).json(user)
       } catch(e) {
           // error. find statuses in https://httpstatuses.com
           errorHandler(res,error)
       }
       

       module.exports.login = async function(req, res) {
        const candidate = await User.findOne({email: req.body.email})
        if (candidate) { 
            const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
            if(passwordResult) {
                // token generation for client if sync passwords. 1 hour.
                const token = jwt.sign({
                    email: candidate.email,
                    userId: candidate._id
                }, keys.jwt , {expiresIn: 60 * 60})
                res.status(200).json({
                    token: token
                })
            } else {
                // incorrect password
                res.status(401).json({
                    message: 'try another password'
                })
            }
        } else {
            reset.status(404).json({
                message : 'user with that email does not found'
            })
        }
       }
       module.exports.register = async function(req, res) {
       }
   } 
}
