const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

//const WebService = require('./models/WebService');
// o inicial-- mongoose.connect('mongodb://admin:admin123@ds155616.mlab.com:55616/auth-sandbox');

const mongo_url = "mongodb+srv://auth-test:admin123@auth-test.b7mv7.mongodb.net/auth-test?retryWrites=true&w=majority"
mongoose.set('useCreateIndex', true);
mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.post('/signup', (req, res, next) => {
  const newUser = new User({
    email: req.body.email,
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 10)
  })
  newUser.save(err => {
    if (err) {
      return res.status(400).json({
        title: 'error',
        error: 'Email já cadastrado'
      })
    }
    return res.status(200).json({
      title: 'Cadastro realizado'
    })
  })
})
app.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).json({
      title: 'Erro ao logar',
      error: err
    })
    if (!user) {
      return res.status(401).json({
        title: 'user not found',
        error: 'Usuário e senha inválidos'
      })
    }
    //incorrect password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        tite: 'login failed',
        error: 'Usuário e senha inválidos'
      })
    }
    //IF ALL IS GOOD create a token and send to frontend
    let token = jwt.sign({ userId: user._id}, 'secretkey');
    var dt = new Date();
    dt.setHours( dt.getHours() + 1 );
    return res.status(200).json({
      title: 'Login realizado com sucesso',
      token: token,
      expiresIn: dt
    })
  })
})

//grabbing user info
app.get('/user', (req, res, next) => {
  let token = req.headers.token; //token
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({
      title: 'unauthorized'
    })
    //token is valid
    User.findOne({ _id: decoded.userId }, (err, user) => {
      if (err) return console.log(err)
      return res.status(200).json({
        title: 'user grabbed',
        user: {
          email: user.email,
          name: user.name
        }
      })
    })

  })
})
/*
app.get('/standard', (req, res, next) => {
  WebService.find(res => {
    localStorage.setItem('standard', res);
  });
})*/

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log('server running on port ' + port);
})
