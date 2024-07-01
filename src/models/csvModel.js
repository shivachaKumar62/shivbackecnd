import mongoose from 'mongoose';

const CSVSchema = new mongoose.Schema({
  csv_path: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

const CSV = mongoose.model('CSV', CSVSchema);

export default CSV;
