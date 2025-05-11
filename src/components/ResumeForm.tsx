import React, { useState } from 'react';
import api from '../services/api'; // Ensure this points to your axios instance with baseURL = http://localhost:8088

const ResumeForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

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

      try {
        const response = await api.post('resume/api/api/resume/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Upload success:', response.data);
      } catch (error) {
        console.error('Error uploading resume', error);
      }
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <button type="submit">Upload Resume</button>
    </form>
  );
};

export default ResumeForm;
