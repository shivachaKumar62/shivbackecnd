import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const adminSchema = new Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  first_name: {
    type: String,
    sparse: true,
  },
  last_name: {
    type: String,
    sparse: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  gmail: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true, // Change to true since password hashing is done
  },
  role: {
    type: Number,
    default: 1,
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
