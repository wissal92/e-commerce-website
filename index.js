const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users')

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({keys: ['shjs8484bdb']}));

app.get('/signup', (req, res) => {
    res.send(`
      <div>
        Your id is: ${req.session.userId}
        <form method='POST'>
           <input name='email' placeholder='email' />
           <input name='password' placeholder='password' />
           <input name='passwordConfirmation' placeholder='password confirmation' />
           <button>Sign Up</button>
        </form>
      </div>
    `)
});


app.post('/signup', async(req, res) => {
    const {email, password, passwordConfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy({email});

    if(existingUser){
      return res.send('Email already use :(')
    }

    if(password !== passwordConfirmation){
      return res.send('Passwords needs to match')
    }
    
    //create a user
    const user = await usersRepo.create({email, password})
    
    //store the id of that user inside the user cookie
    req.session.userId = user.id; //we have access to req.session by the cookie-session library
    res.send('Account was successfully created')
})

app.get('/signout', (req, res) => {
  req.session = null;
  res.send('You are logged out')
})

app.get('/signin', (req, res) => {
  res.send(`
<div>
  <form method='POST'>
     <input name='email' placeholder='email' />
     <input name='password' placeholder='password' />
     <button>Sign Up</button>
  </form>
</div>
  `)
})

app.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    const user = await usersRepo.getOneBy({email});

    if(!user){
      return res.send('Email not found :(')
    }

    if(user.password !== password){
      return res.send('Invalid password')
    }

    req.session.userId = user.id;

    res.send('You are signed in :)')
})
app.listen(3000, (err) => {
    console.log('server is listening on port 3000')
})