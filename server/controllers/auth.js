import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* register a new user */ 

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email, 
            password,
            picturePath, 
            friends, 
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
          });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    }
}

/* login for an existing user */
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user)
            res.status(400).json({
                msg: 'User is not registered.'
            });
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch)
            return res.status(400).json({
                msg: 'Invalid credentials.'
            });
        
        const payload = {
            id: user._id,
            email: email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '12h'
        });

        console.log(token);
        
        delete user.password;
        
        res.status(200).json({
            success: true,
            token,
            user
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    }
}
