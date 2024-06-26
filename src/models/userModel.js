import mongoose from 'mongoose';

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
    username:{
        type:String,
        unique:true
    },
    image:{
        type:String
    },
    country_code:{
        type:Number
    }
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Export the model
const User = mongoose.model('User', userSchema);
export default User;
