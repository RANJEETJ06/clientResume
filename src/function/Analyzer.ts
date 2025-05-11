import api from '../services/api';

const handleAnalyze = async (
  responseData: string,
  jobRole: string,
  setError: (message: string) => void
) => {
  if (!responseData) {
    setError('Please upload a resume first.');
    return;
  }

  if (!jobRole.trim()) {
    setError('Please enter a job role.');
    return;
  }

  try {
    const encodedJobRole = encodeURIComponent(jobRole);
    const url = `/resume/ai/api/ai/analyze/{jobName=${encodedJobRole}}`;

    const response = await api.post(url, { text: responseData });
    return response.data; 
  } catch (err: any) {
    setError(err.message || 'An error occurred during analysis.');
  }
};

export default handleAnalyze;
