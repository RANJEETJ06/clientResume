import React, { useState } from 'react';
import '../css/ResumeForm.css';
import api from '../services/api';
import handleAnalyze from '../function/Analyzer'; // Import the handler
import { AnalysisResult } from '../types/resume';

const ResumeForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [jobRole, setJobRole] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

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

  const handleAnalyzeClick = async () => {
    setLoading(true);
    const result = await handleAnalyze(responseData, jobRole, setError);
    if (result) {
      setAnalysisResult(result); // Set the result
      setResponseData("");
    }
    setLoading(false);
  };

  // Function to render sections dynamically
  const renderSection = (title: string, content: any) => {
    if (!content) return null; // Don't render sections with no content

    return (
      <div className="section">
        <h4>{title}</h4>
        {Array.isArray(content) ? (
          <ul>
            {content.map((item: any, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{content}</p>
        )}
      </div>
    );
  };

  const excludeKeys = ['id']; // List of keys to exclude

  // Function to capitalize the first letter of each key
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' '); // Capitalize and replace underscores with spaces
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

      {/* Show analysis result only after analysis */}
      {analysisResult && (
        <div className="analysis-result">
          <h2>Resume Analysis</h2>
          <div>
            {/* Render dynamic sections, excluding the keys in excludeKeys */}
            {Object.keys(analysisResult.resumeAnalysisDto)
              .filter((key) => !excludeKeys.includes(key))  // Exclude unwanted keys
              .map((key) => {
                const formattedKey = key === 'selection_chance_percent' 
                  ? 'Selection Chance Percent' 
                  : capitalizeFirstLetter(key); // Format key name
                return renderSection(formattedKey, analysisResult.resumeAnalysisDto[key]);
              })}
          </div>

          <h2>Improvements</h2>
          <div>
            {/* Render dynamic improvement sections */}
            {Object.keys(analysisResult.improvements).map((key) => {
              const formattedKey = capitalizeFirstLetter(key); // Format key name
              return renderSection(formattedKey, analysisResult.improvements[key]);
            })}
          </div>
        </div>
      )}

      {/* Only show analyzing spinner inside the response container */}
      {responseData && (
        <div className="response-container">
          {loading ? (
            <div className="loading-spinner">🔄 Analyzing...</div>
          ) : (
            <div>{responseData.split('\n').map((line, index) => <p key={index}>{line}</p>)}</div>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ResumeForm;
