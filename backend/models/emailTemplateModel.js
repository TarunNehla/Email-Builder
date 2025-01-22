const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    templateId: { type: String, unique: true },
    layoutHtml: { type: String, },
    configData: { type: Object, },
  });
  
  const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);

  module.exports = EmailTemplate;