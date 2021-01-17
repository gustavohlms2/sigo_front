const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const webServiceSchema = new Schema({
  titulo: String,
  data_criacao: String,
})

const WebService = mongoose.model('WebService', webServiceSchema);
module.exports = WebService;
