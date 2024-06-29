import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: Number,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
    },
    image:{
        type:String
    },
    country_code:{
        type:Number
    }
});


// Export the model
const User = mongoose.model('User', userSchema);
export default User;
