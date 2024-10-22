'use client';

import { useState } from 'react';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log('Selected file:', selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);  // Changed from 'file' to 'resume'

    try {
      console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);
      const res = await fetch('/api/user/resume', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      console.log('Server response:', data);

      if (res.ok) {
        setMessage('Resume uploaded successfully');
      } else {
        setMessage(data.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
        <button type="submit">Upload Resume</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
