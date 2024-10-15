import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ setResults }) => {
    const [file, setFile] = useState(null);
    const [keywords, setKeywords] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleKeywordsChange = (event) => {
        setKeywords(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('keywords', keywords);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResults(response.data);
        } catch (error) {
            console.error("There was an error uploading the file!", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Upload Your Resume</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="file">Upload Resume (PDF/DOCX):</label>
                    <input type="file" className="form-control" id="file" accept=".pdf,.docx" onChange={handleFileChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="keywords">Enter Keywords (comma-separated):</label>
                    <input type="text" className="form-control" id="keywords" value={keywords} onChange={handleKeywordsChange} required placeholder="e.g. Python, Java, SQL" />
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-lg">Upload Resume</button>
                </div>
            </form>
        </div>
    );
};

export default FileUpload;
