import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import User from '../models/user.model';
const { sendOTPEmail } = require("../config/nodemailer");



export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        coverPhoto: user.coverPhoto,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};




export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}; 




export const requestOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString(); 

    // Set OTP expiration (5 minutes)
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 5);

    // Save OTP and expiration to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    await sendOTPEmail(user.email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

// ✅ Added: Verify OTP and Log In
// export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { email, otp } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !user.otp || !user.otpExpires) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     // Check if OTP is valid
//     if (user.otp !== otp || new Date() > user.otpExpires) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     // Clear OTP after successful login
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     // Generate token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

//     res.json({
//       message: "OTP verified successfully. Logged in!",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };




export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password, confirm_password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if OTP is valid
    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Ensure passwords match
    if (!password || !confirm_password || password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    res.json({
      message: "OTP verified, password updated, and logged in successfully!",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found' });
    }

    const {
      name,
      username,
      bio,
      email,
      phone,
      location,
    } = req.body;

    console.log('Received body:', req.body);

    // Handle uploaded files (via multer.fields)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const avatarFile = files?.['avatar']?.[0];
    const coverFile = files?.['cover']?.[0];

    console.log('Avatar file:', avatarFile);
    console.log('Cover file:', coverFile);

    const avatar = avatarFile?.path;
    const coverPhoto = coverFile?.path;

    const updatedFields: any = {
      name,
      username,
      bio,
      email,
      phone,
      location,
    };

    if (avatar) updatedFields.avatar = avatar;
    if (coverPhoto) updatedFields.coverPhoto = coverPhoto;

    console.log('Fields to update:', updatedFields);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Edit Profile Error:', error.message);
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};
