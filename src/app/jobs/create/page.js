'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateJob() {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    companyLogoUrl: '',
    location: '',
    description: '',
    salary: '',
    employmentType: '',
    experienceLevel: '',
    skills: '',
    workplaceType: '',
    jobType: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobData,
          skills: jobData.skills.split(',').map(skill => skill.trim()),
        }),
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Company Logo URL */}
          <div>
            <label htmlFor="companyLogoUrl" className="block text-sm font-medium text-gray-700 mb-1">Company Logo URL</label>
            <input
              type="url"
              id="companyLogoUrl"
              name="companyLogoUrl"
              value={jobData.companyLogoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Employment Type */}
          <div>
            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <input
              type="text"
              id="employmentType"
              name="employmentType"
              value={jobData.employmentType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Experience Level */}
          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
            <input
              type="text"
              id="experienceLevel"
              name="experienceLevel"
              value={jobData.experienceLevel}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Workplace Type */}
          <div>
            <label htmlFor="workplaceType" className="block text-sm font-medium text-gray-700 mb-1">Workplace Type</label>
            <input
              type="text"
              id="workplaceType"
              name="workplaceType"
              value={jobData.workplaceType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Job Type */}
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <input
              type="text"
              id="jobType"
              name="jobType"
              value={jobData.jobType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={jobData.skills}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows="5"
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        
        <div className="text-center">
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out">
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
}
