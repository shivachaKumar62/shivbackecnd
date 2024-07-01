import User from '../models/userModel.js';
import Setting from '../models/settingModel.js';
import axios from "axios";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const  registerUser = async (req, res) => {
    
  const { phone, email, gmail_token, country_code, password } = req.body;
  
    try {
        if (phone) {
            await sendTwoFactorOTP(country_code, phone);
            res.status(200).json({ message: "OTP sent successfully" });
        }

        if (email) {
         
          const { message, token } = await registerByEmail(email, password,phone);
          return res.status(200).json({ message, token });
        }

        if (gmail_token) {
            await registerByGmail(gmail_token);
            res.status(200).json({ message: "Gmail verification email sent successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

async function sendTwoFactorOTP(country_code, mobile_number) {
    try {
      const api_key = await Setting.findValueByKey("2Factor");
  
      const template_name = "OTP1";
      const url = `https://2factor.in/API/V1/${api_key}/SMS/+${country_code}${mobile_number}/AUTOGEN2/${template_name}`;
  
      const response = await axios.get(url);
  
      return response.data;
    } catch (error) {
      throw new Error("An error occurred while sending the OTP");
    }
  }

async function registerByEmail(email, password) {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
  
      const accessToken = "87819852db76f1a11cbef388e743bc1766bafcce3d3a34c7057d43f798174edc52f0e4dfebec2e1d5b2e91312210b02151441f9487a598894fa9ac3e1adda035" || await Setting.findValueByKey("ACCESS_TOKEN");
      if (!accessToken) {
        throw new Error("Access token not found");
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { message: "user already exists"};
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = new User({
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
      
      return { message: "Successfully registered" };
    } catch (error) {
      throw new Error(`Failed to register by email: ${error.message}`);
    }
  }

async function  registerByGmail(gmail_token){

}


export const otpVerification = async (req, res) => {
    try {
      const { phone, otp, country_code } = req.body;
  
      if (!phone || !otp || !country_code) {
        return res.status(400).json({ message: "Phone, OTP, and country code are required" });
      }
  
      const api_key = await Setting.findValueByKey("2Factor");
      if (!api_key) {
        return res.status(500).json({ message: "2Factor API key not found" });
      }
  
      const url = `https://2factor.in/API/V1/${api_key}/SMS/VERIFY3/${country_code}${phone}/${otp}`;
      const response = await axios.get(url);
  
      if (response.data.Status !== "Success") {
        return res.status(400).json(response.data);
      }
  
      const ACCESS_TOKEN = "87819852db76f1a11cbef388e743bc1766bafcce3d3a34c7057d43f798174edc52f0e4dfebec2e1d5b2e91312210b02151441f9487a598894fa9ac3e1adda035" || await Setting.findValueByKey("ACCESS_TOKEN");
      if (!ACCESS_TOKEN) {
        return res.status(500).json({ message: "Access token not found" });
      }
  
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        // Generate JWT token
        const token = jwt.sign({existingUser }, ACCESS_TOKEN, { expiresIn: '24h' });
        return res.status(200).json({ message: "Successfully logged in", token });
      }
  
      const newUser = new User({
        phone,
        country_code,
      });
  
      await newUser.save();
      const token = jwt.sign({ newUser }, ACCESS_TOKEN, { expiresIn: '24h' });
  
      return res.status(200).json({ message: "Successfully registered", token });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to verify OTP", error: error.message });
    }
  };


export const newPassword = async (req, res) => {
    try {
      const { email, new_password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: 'This email does not exist' });
      }
  
      const isSamePassword = await bcrypt.compare(new_password, user.password);
      if (isSamePassword) {
        return res.status(400).json({ error: 'New password must be different from the old password' });
      }
  
      const hashedPassword = await bcrypt.hash(new_password, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export const userSignIn = async (req, res) => {
    const { email, password } = req.body;

    const accessToken = "87819852db76f1a11cbef388e743bc1766bafcce3d3a34c7057d43f798174edc52f0e4dfebec2e1d5b2e91312210b02151441f9487a598894fa9ac3e1adda035" || await Setting.findValueByKey("ACCESS_TOKEN");
      if (!accessToken) {
        throw new Error("Access token not found");
      }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: "Incorrect password" });
        }
  
        // Generate JWT token
        const token = jwt.sign({ existingUser }, accessToken, { expiresIn: '24h' });
        return res.status(200).json({ message: "Successfully logged in", token });
      }
  
      return res.status(404).json({ message: "This user does not exist" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }; 

export const forgot = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: 'This email does not exist' });
      }
  
      res.status(200).json({ message: 'Email verified' });
  
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};