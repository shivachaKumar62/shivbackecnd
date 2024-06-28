import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
  audio_path: {
    type: String,
    required: true,
  },
  csv_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CSV',
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
    timestamps: true
});

const Audio = mongoose.model('Audio', audioSchema);

export default Audio;
