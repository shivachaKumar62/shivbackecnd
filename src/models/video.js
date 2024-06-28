import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  trim_timing: { type: String, required: false },
  videoPath: { type: String, required: true },
  csv_id:{
    type:String
  },
  uploadedAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
