const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rpd1cExchangeSchema = new Schema({
    year: Number,
    education_form: String,
    education_level: String,
    faculty: String,
    department: String,
    profile: String,
    direction: String,
    discipline: String,
    teachers: Array,
    results: Array,
    zet: Number,
    place: String,
    study_load: Array,
    semester: Number
});

module.exports = mongoose.model('rpd-1c-exchange', rpd1cExchangeSchema);