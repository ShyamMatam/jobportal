'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal'; // Assume we have a Modal component

export default function RecruiterDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, jobsRes, applicationsRes] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/jobs/recruiter'),
          fetch('/api/applications/recruiter')
        ]);

        if (!userRes.ok) throw new Error('Failed to fetch user data');
        if (!jobsRes.ok) throw new Error('Failed to fetch jobs');
        if (!applicationsRes.ok) throw new Error('Failed to fetch applications');

        const userData = await userRes.json();
        const jobsData = await jobsRes.json();
        const applicationsData = await applicationsRes.json();

        setUser(userData);
        setJobs(jobsData);
        setApplications(applicationsData);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewResume = (resumeUrl) => {
    setSelectedResume(resumeUrl);
  };

  const handleCloseResume = () => {
    setSelectedResume(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user || user.role !== 'recruiter') return <div>Access denied</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
      
      <Link href="/job/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create New Job Posting
      </Link>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Job Postings</h2>
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job._id} className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <div className="mt-2">
                <Link href={`/job/${job._id}/edit`} className="text-blue-500 hover:underline mr-4">
                  Edit
                </Link>
                <Link href={`/job/${job._id}/applications`} className="text-green-500 hover:underline">
                  View Applications
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Applications</h2>
        <div className="space-y-4">
          {applications.map(application => (
            <div key={application._id} className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold">{application.jobTitle}</h3>
              <p>Applicant: {application.applicantName}</p>
              <p>Email: {application.applicantEmail}</p>
              {application.resumeUrl ? (
                <button 
                  onClick={() => handleViewResume(application.resumeUrl)}
                  className="text-blue-500 hover:underline"
                >
                  View Resume
                </button>
              ) : (
                <span className="text-gray-500">No resume uploaded</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {selectedResume && (
        <Modal onClose={handleCloseResume}>
          <iframe 
            src={selectedResume} 
            className="w-full h-[80vh]" 
            title="Resume Viewer"
          />
        </Modal>
      )}
    </div>
  );
}
