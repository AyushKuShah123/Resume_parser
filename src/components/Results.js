



import React, { useState } from 'react';
import axios from 'axios';
import Results from './Results'; // Make sure to import your Results component

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('keywords', keywords);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h1>Upload Resume</h1>
      <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
      <input
        type="text"
        placeholder="Enter keywords (comma separated)"
        value={keywords}
        onChange={handleKeywordsChange}
      />
      <button onClick={handleUpload}>Upload</button>

      {result && (
        <Results counts={result.counts} highlightedText={result.highlightedText} keywords={keywords} />
      )}
    </div>
  );
};

export default ResumeUpload;


