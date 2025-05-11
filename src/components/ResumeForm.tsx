import React, { useState } from 'react';
import '../css/ResumeForm.css'; 
import api from '../services/api';
import handleAnalyze from '../function/Analyzer'; // Import the handler

const ResumeForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [jobRole, setJobRole] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append('file', file); 

      setLoading(true);

      try {
        const response = await api.post('resume/api/api/resume/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setResponseData(response.data.text);
        setIsUploaded(true); // Mark as uploaded
      } catch (error) {
        console.error('Error uploading resume', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please select a file first.');
    }
  };

  const handleAnalyzeClick = () => {
    setLoading(true);
    handleAnalyze(responseData, jobRole, setError);
    setLoading(false);
  };

  const formatResponseData = (data: string) => {
    return data.split('\n').map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <div className="resume-form-container">
      {/* Container for Job Role Input and Analyze Button */}
      {isUploaded && (
        <div className="analyze-section">
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="Enter job role (e.g., Spring Boot Developer)"
            className="job-role-input"
          />
          <button className="analyze-button" onClick={handleAnalyzeClick}>
            Analyze
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>Upload Resume</button>
      </form>

      {/* Only show analyzing spinner inside the response container */}
      {responseData && (
        <div className="response-container">
          {loading ? (
            <div className="loading-spinner">🔄 Analyzing...</div>
          ) : (
            <div>{formatResponseData(responseData)}</div>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ResumeForm;
