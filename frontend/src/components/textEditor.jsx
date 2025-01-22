import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function TextEditor({ onChange }) {
  const [value, setValue] = useState('');

  const handleChange = (content) => {
    setValue(content);
    onChange(content); 
  };

  return (
    <div>
      <ReactQuill theme='snow' value={value} onChange={handleChange} />
    </div>
  );
}

export default TextEditor;
