const express = require('express')
const controller = require('../controllers/category')
const passport = require('passport')
const upload = require('../middleware/upload')
const router = express.Router()

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll) 
router.post('/:id', passport.authenticate('jwt', {session: false}), controller.getById) 
router.post('/:id', passport.authenticate('jwt', {session: false}), controller.remove) 
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.create) 
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), controller.update) 

module.exports = router

