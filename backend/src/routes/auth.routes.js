import express from 'express';
import User from '../models/User.js';

const router = express.Router();

console.log('🔧 Creating auth routes...');

// ============ TEST ROUTE ============
router.get('/test', (req, res) => {
  console.log('✅ Auth test route hit');
  res.json({ 
    success: true,
    message: 'Auth routes are working!',
    timestamp: new Date()
  });
});

// ============ SEND OTP ============
router.post('/send-otp', async (req, res) => {
  console.log('\n📱 SEND OTP ROUTE HIT');
  console.log('📩 Request body:', req.body);
  
  try {
    const { phone } = req.body;
    
    // Validate phone
    if (!phone) {
      console.log('❌ Phone missing');
      return res.status(400).json({ 
        success: false,
        message: 'Phone number is required' 
      });
    }
    
    const cleanPhone = phone.replace(/\s/g, '').trim();
    console.log('📱 Cleaned phone:', cleanPhone);
    
    // Validate 10 digits
    if (!/^\d{10}$/.test(cleanPhone)) {
      console.log('❌ Invalid phone format');
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a valid 10-digit phone number' 
      });
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔑 Generated OTP:', otp);
    
    // Find or create user
    let user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      user = new User({ 
        phone: cleanPhone,
        name: "Citizen",
        role: "citizen"
      });
      await user.save();
      console.log('✅ New user created');
    } else {
      console.log('👤 Existing user found');
    }
    
    // Return success with OTP
    console.log('✅ OTP sent successfully');
    res.json({ 
      success: true,
      message: 'OTP sent successfully',
      otp: otp,  // Remove in production
      phone: cleanPhone
    });
    
  } catch (error) {
    console.error('❌ Send OTP Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send OTP: ' + error.message 
    });
  }
});

// ============ VERIFY OTP ============
router.post('/verify-otp', async (req, res) => {
  console.log('\n🔍 VERIFY OTP ROUTE HIT');
  console.log('📩 Request body:', req.body);
  
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      console.log('❌ Phone or OTP missing');
      return res.status(400).json({ 
        success: false,
        message: 'Phone number and OTP are required' 
      });
    }
    
    // Accept ANY 6-digit OTP
    if (!/^\d{6}$/.test(otp)) {
      console.log('❌ Invalid OTP format');
      return res.status(400).json({ 
        success: false,
        message: 'OTP must be 6 digits' 
      });
    }
    
    const cleanPhone = phone.replace(/\s/g, '').trim();
    console.log('📱 Phone:', cleanPhone);
    console.log('🔢 OTP:', otp);
    
    // Find or create user
    let user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      user = new User({ 
        phone: cleanPhone,
        name: "Citizen",
        role: "citizen",
        otpVerified: true
      });
      await user.save();
      console.log('✅ New user created and verified');
    } else {
      user.otpVerified = true;
      await user.save();
      console.log('✅ Existing user verified');
    }
    
    console.log('✅ OTP verified successfully');
    res.json({ 
      success: true,
      message: 'OTP verified successfully!',
      user: {
        phone: user.phone,
        name: user.name,
        role: user.role,
        otpVerified: user.otpVerified
      }
    });
    
  } catch (error) {
    console.error('❌ Verify OTP Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify OTP: ' + error.message 
    });
  }
});

// ============ CHECK USER ============
router.get('/check/:phone', async (req, res) => {
  console.log('\n👤 CHECK USER ROUTE HIT');
  console.log('📱 Phone:', req.params.phone);
  
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) {
      console.log('❌ User not found');
      return res.json({ 
        success: true,
        exists: false,
        message: 'User not found'
      });
    }
    
    console.log('✅ User found');
    res.json({
      success: true,
      exists: true,
      user: {
        phone: user.phone,
        name: user.name,
        role: user.role,
        otpVerified: user.otpVerified
      }
    });
  } catch (error) {
    console.error('❌ Check user error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

console.log('✅ Auth routes created successfully:');
console.log('  GET  /api/auth/test');
console.log('  POST /api/auth/send-otp');
console.log('  POST /api/auth/verify-otp');
console.log('  GET  /api/auth/check/:phone');

export default router;