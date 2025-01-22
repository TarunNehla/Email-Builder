import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client"; 
import axios from "axios";
import TextEditor from "./textEditor";
import ImageUploader from "./imageUploader";
import { renderAndDownloadTemplate } from "../utils/downloadTemplate";
import { saveTemplate } from "../utils/saveTemplate";

const BASE_URL = '/api';

const EmailEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(""); 
  const [templateId, setTemplateId] = useState(""); 
  const [configData, setConfigData] = useState({ content: "" }); 
  const [title, setTitle] = useState("");
  const [footer, setFooter] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const templates = [
    { id: "layout1", name: "Template 1", description: "Active (working)" },
    { id: "layout2", name: "Template 2", description: "Dummy" },
    { id: "layout3", name: "Template 3", description: "Dummy" },
  ];

  const loadTemplate = (id) => {
    axios
      .get(`${BASE_URL}/getEmailLayout?layout=${id}`)
      .then((response) => {
        setSelectedTemplate(response.data);
        setTemplateId(id);
      })
      .catch((error) => {
        console.error("Error fetching template:", error);
      });
  };

  
  useEffect(() => {
    const textEditorContainer = document.getElementById("text-editor");
    if (textEditorContainer) {
      const root = ReactDOM.createRoot(textEditorContainer);
      root.render(
        <TextEditor
          onChange={(data) => setConfigData((prev) => ({ ...prev, content: data }))}
        />
      );
    }

    const imageUploaderContainer = document.getElementById("image-uploader");
    if (imageUploaderContainer) {
      const root = ReactDOM.createRoot(imageUploaderContainer);
      root.render(
        <ImageUploader
          onUpload={(url) => setImageUrl(url)} 
        />
      );
    }

    const titleInput = document.getElementById("title-input");
    if (titleInput) {
      titleInput.value = title;
      titleInput.addEventListener("input", (e) => setTitle(e.target.value));
      console.log('value of title', title);
    }

    const footerInput = document.getElementById("footer-input");
    if (footerInput) {
      footerInput.value = footer;
      footerInput.addEventListener("input", (e) => setFooter(e.target.value));
    }

    return () => {
      if (titleInput) {
        titleInput.removeEventListener("input", (e) => setTitle(e.target.value));
      }
      if (footerInput) {
        footerInput.removeEventListener("input", (e) => setFooter(e.target.value));
      }
    };


  }, [selectedTemplate, title, footer]);

  return (
    <div>
      <div className="template-container">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${templateId === template.id ? "selected" : ""}`}
            onClick={() => loadTemplate(template.id)}
          >
            <h3>{template.name}</h3>
            <p>{template.description}</p>
          </div>
        ))}
      </div>

      <p className="pp">** There is an inconvenience that you need to enter Title and footer text first and then content and image. For now, I will fix it soon.</p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        {selectedTemplate ? (
          <div dangerouslySetInnerHTML={{ __html: selectedTemplate }} />
        ) : (
          <p className="pp">Please select a template to start editing.</p>
        )}
      </div>

      <div className="template-container">
      <button className="btton" onClick={() => saveTemplate(templateId, selectedTemplate, configData, title, footer)}>
        Save Template
      </button>

      <button className="btton" onClick={() => renderAndDownloadTemplate(templateId, selectedTemplate, configData, title, footer, imageUrl)}>
        Render & Download Template
      </button>
      </div>
    </div>
  );
};



export default EmailEditor;
