const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rpdChangeableValuesSchema = new Schema({
  title: String,
  value: String
});

module.exports = mongoose.model('rpd-changeable-values', rpdChangeableValuesSchema);