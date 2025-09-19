// Simulate API calls with delays
export const fetchCountries = async () => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock country data with dial codes and flags
    return [
      { name: 'United States', dial_code: '+1', code: 'US', flag: '🇺🇸' },
      { name: 'United Kingdom', dial_code: '+44', code: 'GB', flag: '🇬🇧' },
      { name: 'Canada', dial_code: '+1', code: 'CA', flag: '🇨🇦' },
      { name: 'India', dial_code: '+91', code: 'IN', flag: '🇮🇳' },
      { name: 'Australia', dial_code: '+61', code: 'AU', flag: '🇦🇺' },
      { name: 'Germany', dial_code: '+49', code: 'DE', flag: '🇩🇪' },
      { name: 'France', dial_code: '+33', code: 'FR', flag: '🇫🇷' },
      { name: 'Japan', dial_code: '+81', code: 'JP', flag: '🇯🇵' },
      { name: 'China', dial_code: '+86', code: 'CN', flag: '🇨🇳' },
      { name: 'Brazil', dial_code: '+55', code: 'BR', flag: '🇧🇷' },
      { name: 'Russia', dial_code: '+7', code: 'RU', flag: '🇷🇺' },
      { name: 'South Korea', dial_code: '+82', code: 'KR', flag: '🇰🇷' },
      { name: 'Italy', dial_code: '+39', code: 'IT', flag: '🇮🇹' },
      { name: 'Spain', dial_code: '+34', code: 'ES', flag: '🇪🇸' },
      { name: 'Mexico', dial_code: '+52', code: 'MX', flag: '🇲🇽' },
      { name: 'Netherlands', dial_code: '+31', code: 'NL', flag: '🇳🇱' },
      { name: 'Sweden', dial_code: '+46', code: 'SE', flag: '🇸🇪' },
      { name: 'Norway', dial_code: '+47', code: 'NO', flag: '🇳🇴' },
      { name: 'Denmark', dial_code: '+45', code: 'DK', flag: '🇩🇰' },
      { name: 'Finland', dial_code: '+358', code: 'FI', flag: '🇫🇮' },
      { name: 'Switzerland', dial_code: '+41', code: 'CH', flag: '🇨🇭' },
      { name: 'Austria', dial_code: '+43', code: 'AT', flag: '🇦🇹' },
      { name: 'Belgium', dial_code: '+32', code: 'BE', flag: '🇧🇪' },
      { name: 'Poland', dial_code: '+48', code: 'PL', flag: '🇵🇱' },
      { name: 'Czech Republic', dial_code: '+420', code: 'CZ', flag: '🇨🇿' },
      { name: 'Hungary', dial_code: '+36', code: 'HU', flag: '🇭🇺' },
      { name: 'Romania', dial_code: '+40', code: 'RO', flag: '🇷🇴' },
      { name: 'Bulgaria', dial_code: '+359', code: 'BG', flag: '🇧🇬' },
      { name: 'Croatia', dial_code: '+385', code: 'HR', flag: '🇭🇷' },
      { name: 'Slovenia', dial_code: '+386', code: 'SI', flag: '🇸🇮' },
      { name: 'Slovakia', dial_code: '+421', code: 'SK', flag: '🇸🇰' },
      { name: 'Estonia', dial_code: '+372', code: 'EE', flag: '🇪🇪' },
      { name: 'Latvia', dial_code: '+371', code: 'LV', flag: '🇱🇻' },
      { name: 'Lithuania', dial_code: '+370', code: 'LT', flag: '🇱🇹' },
      { name: 'Greece', dial_code: '+30', code: 'GR', flag: '🇬🇷' },
      { name: 'Portugal', dial_code: '+351', code: 'PT', flag: '🇵🇹' },
      { name: 'Ireland', dial_code: '+353', code: 'IE', flag: '🇮🇪' },
      { name: 'Luxembourg', dial_code: '+352', code: 'LU', flag: '🇱🇺' },
      { name: 'Malta', dial_code: '+356', code: 'MT', flag: '🇲🇹' },
      { name: 'Cyprus', dial_code: '+357', code: 'CY', flag: '🇨🇾' },
      { name: 'Turkey', dial_code: '+90', code: 'TR', flag: '🇹🇷' },
      { name: 'Israel', dial_code: '+972', code: 'IL', flag: '🇮🇱' },
      { name: 'Saudi Arabia', dial_code: '+966', code: 'SA', flag: '🇸🇦' },
      { name: 'United Arab Emirates', dial_code: '+971', code: 'AE', flag: '🇦🇪' },
      { name: 'Egypt', dial_code: '+20', code: 'EG', flag: '🇪🇬' },
      { name: 'South Africa', dial_code: '+27', code: 'ZA', flag: '🇿🇦' },
      { name: 'Nigeria', dial_code: '+234', code: 'NG', flag: '🇳🇬' },
      { name: 'Kenya', dial_code: '+254', code: 'KE', flag: '🇰🇪' },
      { name: 'Argentina', dial_code: '+54', code: 'AR', flag: '🇦🇷' },
      { name: 'Chile', dial_code: '+56', code: 'CL', flag: '🇨🇱' },
      { name: 'Colombia', dial_code: '+57', code: 'CO', flag: '🇨🇴' },
      { name: 'Peru', dial_code: '+51', code: 'PE', flag: '🇵🇪' },
      { name: 'Venezuela', dial_code: '+58', code: 'VE', flag: '🇻🇪' },
      { name: 'New Zealand', dial_code: '+64', code: 'NZ', flag: '🇳🇿' },
      { name: 'Singapore', dial_code: '+65', code: 'SG', flag: '🇸🇬' },
      { name: 'Malaysia', dial_code: '+60', code: 'MY', flag: '🇲🇾' },
      { name: 'Thailand', dial_code: '+66', code: 'TH', flag: '🇹🇭' },
      { name: 'Indonesia', dial_code: '+62', code: 'ID', flag: '🇮🇩' },
      { name: 'Philippines', dial_code: '+63', code: 'PH', flag: '🇵🇭' },
      { name: 'Vietnam', dial_code: '+84', code: 'VN', flag: '🇻🇳' },
      { name: 'Taiwan', dial_code: '+886', code: 'TW', flag: '🇹🇼' },
      { name: 'Hong Kong', dial_code: '+852', code: 'HK', flag: '🇭🇰' }
    ];
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const sendOTP = async (phoneNumber, countryCode) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate OTP generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in localStorage for verification
    localStorage.setItem('temp_otp', otp);
    localStorage.setItem('temp_phone', `${countryCode}${phoneNumber}`);
    
    console.log(`OTP sent to ${countryCode}${phoneNumber}: ${otp}`);
    
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOTP = async (otp) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const storedOTP = localStorage.getItem('temp_otp');
    const storedPhone = localStorage.getItem('temp_phone');
    
    if (storedOTP === otp) {
      // Clear temporary data
      localStorage.removeItem('temp_otp');
      localStorage.removeItem('temp_phone');
      
      return { 
        success: true, 
        user: {
          id: Date.now().toString(),
          phone: storedPhone,
          name: `User ${storedPhone.slice(-4)}`,
          avatar: null
        }
      };
    } else {
      throw new Error('Invalid OTP');
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Simulate AI response generation
export const generateAIResponse = async (userMessage) => {
  try {
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const responses = [
      "That's an interesting question! Let me think about that...",
      "I understand what you're asking. Here's my perspective on that topic.",
      "Great question! Based on my knowledge, I can help you with that.",
      "I see what you mean. Let me provide some insights on this.",
      "That's a fascinating topic! Here's what I think about it...",
      "I appreciate you sharing that with me. Let me respond thoughtfully.",
      "That's a complex question that deserves a detailed answer.",
      "I'm glad you asked! This is something I can definitely help with.",
      "Interesting perspective! Let me share my thoughts on this.",
      "I understand your concern. Here's how I would approach this..."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      content: `${randomResponse}\n\nI'm a simulated AI assistant, so my responses are generated for demonstration purposes. In a real application, this would connect to an actual AI service like Gemini or ChatGPT.`,
      timestamp: new Date().toISOString(),
      isAI: true
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};
