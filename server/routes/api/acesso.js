const express = require('express');
//const cors = require('cors');
const User = require('../../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const mongo_url = "mongodb+srv://auth-test:admin123@auth-test.b7mv7.mongodb.net/auth-test?retryWrites=true&w=majority"
mongoose.set('useCreateIndex', true);
mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });

/*
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', serveStatic(path.join(__dirname, '/dist')));
*/
    const router = express.Router();

    //routes
    router.post('/signup', (req, res, next) => {
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
    router.post('/login', (req, res, next) => {
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
    router.get('/user', (req, res, next) => {
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

module.exports = router;