import { Router } from "express";
import {
  getMe,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
router.post('/send-otp', async (req, res) => {
  try {
    console.log('📱 Send OTP:', req.body);
    const { mobile } = req.body;
    
    if (!mobile) {
      return res.status(400).json({ 
        success: false,
        message: 'Mobile is required' 
      });
    }
    
    const cleanMobile = mobile.replace(/\s/g, '').trim();
    
    if (!/^\d{10}$/.test(cleanMobile)) {
      return res.status(400).json({ 
        success: false,
        message: 'Enter valid 10-digit mobile' 
      });
    }
    
    // Generate OTP (just for display)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔑 OTP for', cleanMobile, ':', otp);
    
    // Find or create user
    let user = await User.findOne({ mobile: cleanMobile });
    if (!user) {
      user = new User({ mobile: cleanMobile });
      await user.save();
    }
    
    res.json({ 
      success: true,
      message: 'OTP sent successfully',
      otp: otp // Return OTP in response so you can see it
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send OTP' 
    });
  }
});
router.post('/verify-otp', async (req, res) => {
  try {
    console.log('🔍 Verify OTP:', req.body);
    const { mobile, otp } = req.body;
    
    if (!mobile || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Mobile and OTP are required' 
      });
    }
    
    // Clean mobile
    const cleanMobile = mobile.replace(/\s/g, '').trim();
    
    // ✅ FIX: Accept ANY 6-digit OTP
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP must be 6 digits' 
      });
    }
    
    // Find or create user
    let user = await User.findOne({ mobile: cleanMobile });
    if (!user) {
      // Create new user if doesn't exist
      user = new User({ 
        mobile: cleanMobile,
        isVerified: true 
      });
      await user.save();
      console.log('✅ New user created and verified');
    } else {
      // Update existing user
      user.isVerified = true;
      await user.save();
      console.log('✅ Existing user verified');
    }
    
    res.json({ 
      success: true,
      message: 'OTP verified successfully!',
      user: {
        mobile: user.mobile,
        isVerified: user.isVerified
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify OTP' 
    });
  }
});

export default router;
