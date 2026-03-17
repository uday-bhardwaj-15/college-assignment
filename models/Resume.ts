import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      required: true,
    },
    parsedText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
