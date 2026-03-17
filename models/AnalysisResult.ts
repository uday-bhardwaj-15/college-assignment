import mongoose from 'mongoose';

const AnalysisResultSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      unique: true, // A resume should typically have one active analysis associated with it at a time.
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
    },
    detectedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    latexCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AnalysisResult || mongoose.model('AnalysisResult', AnalysisResultSchema);
