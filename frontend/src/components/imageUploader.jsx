import React, { useState } from "react";
import axios from "axios";
import '../App.css';

const BASE_URL = process.env.BASE_URL;

const ImageUploader = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${BASE_URL}/uploadImage`, formData);
      onUpload(response.data.imageUrl);
      setPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      handleUpload(file);
    }
  };

  return (
    <div>
      <label>Upload Image</label>
      <div className="imageUp"
        onClick={() => document.getElementById("fileInput").click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          "Click to upload"
        )}
      </div>
      <input
        id="fileInput"
        type="file"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
};

export default ImageUploader;
