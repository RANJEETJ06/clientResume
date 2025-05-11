import React, { useState } from 'react';
import '../css/ResumeForm.css'; 
import api from '../services/api';
import handleAnalyze from '../function/Analyzer';
import ErrorMessage from './ErrorMessage';

const ResumeForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<string>('');
  const [jobRole, setJobRole] = useState<string>(''); // ⬅️ NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append('file', file); 

      setLoading(true);
      setError(null);

      try {
        const response = await api.post('resume/api/api/resume/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setResponseData(response.data.text); 
      } catch (error: any) {
        console.error('Error uploading resume', error);
        setError('Failed to upload resume. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please select a file first.');
    }
  };

  const formatResponseData = (data: string) => {
    return data
      .split('\n')
      .map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <div className="resume-form-container">
      {error && <ErrorMessage message={error} />}

      {/* Job Role + Analyze button side by side */}
      {responseData && !loading && (
  <div className="analyze-section">
    <input
      type="text"
      placeholder="Enter target job role"
      value={jobRole}
      onChange={(e) => setJobRole(e.target.value)}
      className="job-role-input"
    />
    <button
      className="analyze-button"
      onClick={() => handleAnalyze(responseData, jobRole, setError)}
    >
      Analyze
    </button>
  </div>
)}


      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>Upload Resume</button>
      </form>

      {loading && <p>Uploading...</p>}

      {responseData && (
        <div className="response-container">
          <h3>Response Data:</h3>
          <div>{formatResponseData(responseData)}</div>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;
