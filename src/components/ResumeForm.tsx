import React, { useState } from 'react';
import '../css/ResumeForm.css'; 
import api from '../services/api'; // Ensure this points to your axios instance with baseURL = http://localhost:8088

const ResumeForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<string>(''); // State to store the response data
  const [loading, setLoading] = useState(false); // State to manage loading status

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append('file', file); // Key must match @RequestParam("file")

      setLoading(true); // Set loading to true when the request starts

      try {
        const response = await api.post('resume/api/api/resume/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setResponseData(response.data.text); 
      } catch (error) {
        console.error('Error uploading resume', error);
      } finally {
        setLoading(false); // Set loading to false when the request ends
      }
    } else {
      alert('Please select a file first.');
    }
  };

  // Function to format and render the response text in a readable way
  const formatResponseData = (data: string) => {
    return data
      .split('\n') // Split the text by newlines
      .map((line, index) => <p key={index}>{line}</p>); // Map each line to a <p> tag for better readability
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>Upload Resume</button>
      </form>

      {/* Display loading status */}
      {loading && <p>Uploading...</p>}

      {/* Display formatted response data if available */}
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
