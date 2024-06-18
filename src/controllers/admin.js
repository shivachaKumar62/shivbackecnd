import Admin from '../models/admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerAdmin = async (req, res) => {
  try {
    const { email, first_name, last_name, username, phone,  password } = req.body;

    // Check if email, phone, or Gmail is provided
    if (!email && !phone ) {
      return res.status(400).json({ message: 'Email, phone, or Gmail is required' });
    }

    // Check if email, phone, or Gmail is unique
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { phone }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email, phone, or Gmail already exists' });
    }

    // Hash the password if it's provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create a new admin
    const newAdmin = new Admin({
      email,
      first_name,
      last_name,
      username,
      phone,
      password: hashedPassword, // Save the hashed password or null if not provided
    });

    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send('Email and password are required for login');
    }

    const admin = await Admin.findOne({ email });


    if (!admin) {
      return res.status(400).send('Invalid email or password');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const isMatch = await bcrypt.compare(password, hashedPassword);
    

    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    const token = jwt.sign({ _id: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.send({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in: ' + error.message);
  }
};

export const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).send({ error: 'Admin not found' });
    }
    res.status(200).send({
      id: admin._id,
      email: admin.email,
      password: admin.password,
      // Add other admin properties here
    });
  } catch (error) {
    res.status(400).send({ error: 'Invalid ID format' });
  }
};


export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 }); // Exclude the password field from the response
    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  console.log('Request Params:', req.params);
  console.log('Request Body:', req.body);

  // Validate input data
  if (!email || !password) {
    return res.status(400).send({ error: 'Email and password are required' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { email, password: hashedPassword },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).send({ error: 'Admin not found' });
    }

    res.status(200).send({
      id: updatedAdmin._id,
      email: updatedAdmin.email,
      // You can include other admin properties here
    });
  } catch (error) {
    res.status(400).send({ error: 'Invalid input data' });
  }
};
