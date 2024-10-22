import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String },
  location: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String, required: true },
  employmentType: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  skills: [{ type: String }],
  workplaceType: { type: String, required: true },
  jobType: { type: String, required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyLogoUrl: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job;