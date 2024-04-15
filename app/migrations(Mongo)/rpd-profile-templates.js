const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rpdProfileTemplatesSchema = new Schema({
  profile_server_key: String,

  disciplins_name: String,
  year: Number,
  uni_name: String,
  faculty: String,
  department: String,
  direction_of_study: String,
  profile: String,
  level_education: String,
  form_education: String,
  teacher: String,
  protocol: String,
  goals: String,
  place: String,
  semester: Number,
  certification: String,
  place_more_text: String,
  competencies: Object,
  zet: Number,
  content: Object,
  content_more_text: String,
  content_template_more_text: String,
  methodological_support_template: String,
  assessment_tools_template: String,
  textbook: String,
  additional_textbook: String,
  professional_information_resources: String,
  software: String,
  logistics_template: String
});

module.exports = mongoose.model('rpd-profile-templates', rpdProfileTemplatesSchema);