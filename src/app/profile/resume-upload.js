'use client';

import { useState } from 'react';

export default function ResumeUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/user/resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload resume');

      const data = await res.json();
      onUploadSuccess(data.resumeUrl);
      setUploading(false);
    } catch (err) {
      setError('Error uploading resume. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-2"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
          (!file || uploading) && 'opacity-50 cursor-not-allowed'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Resume'}
      </button>
    </div>
  );
}






