import axios from "axios";
const BASE_URL = process.env.BASE_URL;

export const saveTemplate = (templateId, selectedTemplate, configData, title, footer) => {
    if (!templateId || !selectedTemplate) {
      alert("Please select a template before saving.");
      return;
    }
  
    const payload = {
      templateId,
      layoutHtml: selectedTemplate,
      configData: configData,
      title: title,
      footer: footer,
    };
  
    console.log('payload', payload);
  
    axios
      .post(`${BASE_URL}/uploadEmailConfig`, payload)
      .then((response) => {
        alert("Template saved successfully!");
      })
      .catch((error) => {
        alert("Failed to save template. Please try again.");
      });
};
  
 