import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      phoneNumber: '',
      countryCode: '+1',
      otpSent: false,
      otpVerified: false,
      
      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
      setCountryCode: (countryCode) => set({ countryCode }),
      setOtpSent: (otpSent) => set({ otpSent }),
      setOtpVerified: (otpVerified) => set({ otpVerified }),
      
      login: (userData) => set({ 
        isAuthenticated: true, 
        user: userData,
        otpSent: false,
        otpVerified: false 
      }),
      
      logout: () => set({ 
        isAuthenticated: false, 
        user: null,
        phoneNumber: '',
        countryCode: '+1',
        otpSent: false,
        otpVerified: false 
      }),
      
      resetAuth: () => set({
        otpSent: false,
        otpVerified: false,
        phoneNumber: '',
        countryCode: '+1'
      })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user 
      })
    }
  )
);

export default useAuthStore;
