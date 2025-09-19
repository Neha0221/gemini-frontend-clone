import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import PhoneInput from './PhoneInput';
import OTPVerification from './OTPVerification';
import { sendOTP } from '../utils/api';
import useAuthStore from '../store/authStore';
import styles from '../styles/Auth.module.css';

const Auth = () => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  
  const { 
    phoneNumber, 
    countryCode, 
    setOtpSent, 
    login, 
    resetAuth 
  } = useAuthStore();

  const handlePhoneSubmit = async (data) => {
    setLoading(true);
    
    try {
      const result = await sendOTP(data.phoneNumber, data.countryCode);
      
      if (result.success) {
        setOtpSent(true);
        setStep('otp');
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = (user) => {
    login(user);
    toast.success('Welcome to Gemini Chat!');
  };

  const handleBackToPhone = () => {
    resetAuth();
    setStep('phone');
  };

  const handleResendOTP = async () => {
    setLoading(true);
    
    try {
      const result = await sendOTP(phoneNumber, countryCode);
      
      if (result.success) {
        toast.success('OTP resent successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {step === 'phone' ? (
          <PhoneInput 
            onNext={handlePhoneSubmit}
            loading={loading}
          />
        ) : (
          <OTPVerification 
            onSuccess={handleOTPSuccess}
            onBack={handleBackToPhone}
            onResend={handleResendOTP}
            loading={loading}
          />
        )}
      </div>
      
      <div className={styles.footer}>
        <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
};

export default Auth;
