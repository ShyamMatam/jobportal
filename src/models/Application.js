import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  resumeUrl: String,
  // or
  resumeFile: {
    filename: String,
    path: String,
    mimetype: String
  }
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application;
