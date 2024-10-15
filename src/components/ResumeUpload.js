

import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './ResumeUpload.css'; // Import custom CSS for additional styling

const ResumeUpload = () => {
    // State declarations
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
        <div className="container mt-5">
            <h1
                className="text-center mb-4"
                style={{
                    fontSize: '2.5rem',
                    color: '#007bff',
                    textShadow: '3px 3px 5px rgba(0, 0, 0, 0.5)', // Added shadow effect
                }}
            >
                Resume Parser
            </h1>
            <div className="card p-4 shadow-lg" style={{ borderRadius: '15px' }}>
                <div className="mb-3">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                        className="form-control-file"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Enter keywords (comma separated)"
                        value={keywords}
                        onChange={handleKeywordsChange}
                        className="form-control"
                        style={{ borderRadius: '10px' }}
                    />
                </div>
                <button onClick={handleUpload} className="btn btn-success w-100">
                    Upload Resume
                </button>
            </div>

            {result && (
                <div className="mt-4">
                    <h2 className="mt-4">Keyword Counts</h2>
                    <pre className="bg-light p-3 rounded" style={{ border: '1px solid #ced4da' }}>
                        {JSON.stringify(result.counts, null, 2)}
                    </pre>
                    <h2 className="mt-4">Highlighted Text</h2>
                    <div
                        className="border p-3 bg-light rounded"
                        style={{ border: '1px solid #ced4da' }}
                        dangerouslySetInnerHTML={{ __html: result.highlightedText.join('<br />') }}
                    />
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;






