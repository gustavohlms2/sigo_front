const amqp = require('amqplib/callback_api');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var pendenciaNorma = false;
var pendenciaProcesso = false;

var newMsgNorma = '';
var newMsgProcesso = '';
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
      pendenciaNorma = true;  
      newMsgNorma = msg.content.toString();       
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
      console.log('Consumindo alerta processos');
      pendenciaProcesso = true;   
      newMsgProcesso = msg.content.toString();      
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
/*    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 10000);*/
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
        var msg = 'Alerta de estoque baixo!';
        console.log('Criado');
        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log('Enviado processo');
    });
/*    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 10000);*/
});


app.get('/rabbit_norma', (req, res, next) => { 

  return res.status(200).json({
    mostra: pendenciaNorma,
    msg: newMsgNorma
  })

});

app.get('/rabbit_processo', (req, res, next) => { 

  return res.status(200).json({
    mostra: pendenciaProcesso,
    msg: newMsgProcesso
  })

});

const port = process.env.PORT || 5050;

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log('rabbit running on port ' + port);
})
