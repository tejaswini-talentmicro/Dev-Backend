import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        LastName: {
            type: String,
            required: true
        },
        emailId: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email address');
                }
            }

        },
        password: {
            type: String,
            required: true
        },
        age: {
            type: Number
        },
        gender: {
            type: String
        },
        keySkills: {
            type: [String],
            //skills should not be more than 10
            validate(value) {
                if (value.length > 10) {
                    throw new Error('Skills should not be more than 10');
                }
            }
        }
    },
    {
        timestamps: true
    }
);

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ id: user._id }, 'secretKey');
    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}


const User = mongoose.model("User", userSchema);
export default User;