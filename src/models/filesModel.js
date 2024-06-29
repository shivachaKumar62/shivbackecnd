import mongoose from 'mongoose';

const filesSchema = new mongoose.Schema({
  path: {
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
  file_type:{
    type:String
  }
}, {
    timestamps: true
});

const File = mongoose.model('File', filesSchema);

export default File;
