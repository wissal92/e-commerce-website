const express = require('express');
const {handleErrors} = require('./middlwares');
const usersRepo = require('../../repositories/users');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');
const {requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPassword} = require('./validators');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signUpTemplate({req}))
});


router.post('/signup', [requireEmail, requirePassword, requirePasswordConfirmation], handleErrors(signUpTemplate), async(req, res) => {

    const {email, password, passwordConfirmation} = req.body;

 
    //create a user
    const user = await usersRepo.create({email, password})
    
    //store the id of that user inside the user cookie
    req.session.userId = user.id; //we have access to req.session by the cookie-session library
    res.redirect('/admin/products');
})

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out')
})

router.get('/signin', (req, res) => {
  res.send(signInTemplate({}))
})

router.post('/signin', [requireEmailExists, requireValidPassword],handleErrors(signInTemplate), async (req, res) => {
    const {email} = req.body;

    const user = await usersRepo.getOneBy({email});
    
    req.session.userId = user.id;


    res.redirect('/admin/products');
})

module.exports = router;