import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { verifyOTP } from '../utils/api';
import { otpSchema } from '../utils/validation';
import useAuthStore from '../store/authStore';
import styles from '../styles/OTPVerification.module.css';

const OTPVerification = ({ onSuccess, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  
  const { phoneNumber, countryCode, setOtpVerified } = useAuthStore();
  const inputRefs = useRef([]);

  const {
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    // Start resend timer
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValue('otp', newOtp.join(''));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (pastedOtp.length === 6) {
      const newOtp = pastedOtp.split('');
      setOtp(newOtp);
      setValue('otp', pastedOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const otpString = otp.join('');
      const { errors } = otpSchema.validate({ otp: otpString });
      
      if (errors) {
        setError('Please enter a valid 6-digit OTP');
        setLoading(false);
        return;
      }

      const result = await verifyOTP(otpString);
      
      if (result.success) {
        setOtpVerified(true);
        onSuccess(result.user);
      }
    } catch (error) {
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCanResend(false);
      setResendTimer(30);
      
      // Restart timer
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={onBack}
          disabled={loading}
        >
          ← Back
        </button>
        <h1>Verify Phone Number</h1>
        <p>Enter the 6-digit code sent to</p>
        <p className={styles.phoneNumber}>{countryCode} {phoneNumber}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`${styles.otpInput} ${errors.otp ? styles.error : ''}`}
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}

        <button 
          type="submit" 
          className={styles.verifyButton}
          disabled={loading || otp.some(digit => !digit)}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className={styles.footer}>
        <p>Didn't receive the code?</p>
        <button
          className={styles.resendButton}
          onClick={handleResend}
          disabled={!canResend || loading}
        >
          {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
