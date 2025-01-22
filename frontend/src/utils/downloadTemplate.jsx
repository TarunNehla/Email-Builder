import axios from "axios";
const BASE_URL = process.env.BASE_URL;
  
export const renderAndDownloadTemplate = (templateId, selectedTemplate, configData, title, footer, imageUrl) => {
  if (!templateId || !selectedTemplate) {
    alert("Please select a template before rendering.");
    return;
  }

  const payload = {
    templateId,
    values: {},
    editorContent: configData.content,
    title: title,
    footer: footer,
    imageUrl: imageUrl, 
  };
  console.log('lets check payload : ', payload);

  axios
    .post(`${BASE_URL}/renderAndDownloadTemplate`, payload, {
      responseType: 'blob',
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${templateId}_customized.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch((error) => {
      alert("Failed to render and download template. Please try again.");
    });
};