const express = require('express');
//const cors = require('cors');
const User = require('../../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const mongo_url = "mongodb+srv://auth-test:admin123@auth-test.b7mv7.mongodb.net/auth-test?retryWrites=true&w=majority"
mongoose.set('useCreateIndex', true);
mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });

const amqp = require('amqplib/callback_api');
let statusRabbit = {};

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

    router.get('/rabbit_norma', (req, res, next) => { 
        console.log('Pesquisando normas novas');
        return res.status(200).json({
          mostra: statusRabbit['pendenciaNorma'],
          msg: statusRabbit['newMsgNorma']
        })
  
    });
  
    router.get('/rabbit_processo', (req, res, next) => { 
        console.log('Pesquisando processos novos');
        return res.status(200).json({
            mostra: statusRabbit['pendenciaProcesso'],
            msg: statusRabbit['newMsgProcesso']
        })

    });
/*

    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
        throw error0;
        }
        connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'repositorio';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.consume(queue, function(msg) {
            console.log('Consumindo novas normas');
            statusRabbit['pendenciaNorma'] = true;  
            statusRabbit['newMsgNorma'] = msg.content.toString();       
        }, {
            noAck: true
        });
        
        });
    });

    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
        throw error0;
        }
        connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'processo';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.consume(queue, function(msg) {
            console.log('Consumindo alertas de processos');
            statusRabbit['pendenciaProcesso'] = true;   
            statusRabbit['newMsgProcesso'] = msg.content.toString();      
        }, {
            noAck: true
        });
        
        });
    });

    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        console.log('Criando');
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'repositorio';
            var msg = 'Novas normas';

            console.log('Criado normas');
            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log('Enviado normas');
        });
        setTimeout(function() {
            connection.close();
            process.exit(0);
        }, 10000);
    });

    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        console.log('Criando msg processo');
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'processo';
            var msg = 'Alerta de processo em finalização!';
            console.log('Criado');
            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(msg));

            console.log('Enviado processo');
        });
        setTimeout(function() {
            connection.close();
            process.exit(0);
        }, 10000);
    }); */

module.exports = router; 