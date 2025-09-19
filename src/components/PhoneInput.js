import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { fetchCountries } from '../utils/api';
import { phoneSchema } from '../utils/validation';
import useAuthStore from '../store/authStore';
import styles from '../styles/PhoneInput.module.css';

const PhoneInput = ({ onNext }) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  
  const { countryCode, phoneNumber, setCountryCode, setPhoneNumber } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      countryCode: countryCode,
      phoneNumber: phoneNumber
    }
  });

  const watchedCountryCode = watch('countryCode');
  const watchedPhoneNumber = watch('phoneNumber');

  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);
      const countryData = await fetchCountries();
      setCountries(countryData);
      setFilteredCountries(countryData);
      
      // Set default country (US)
      const defaultCountry = countryData.find(country => country.code === 'US');
      if (defaultCountry) {
        setSelectedCountry(defaultCountry);
        setValue('countryCode', defaultCountry.dial_code);
      }
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    setCountryCode(watchedCountryCode);
    setPhoneNumber(watchedPhoneNumber);
  }, [watchedCountryCode, watchedPhoneNumber, setCountryCode, setPhoneNumber]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(query.toLowerCase()) ||
        country.dial_code.includes(query)
      );
      setFilteredCountries(filtered);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setValue('countryCode', country.dial_code);
    setShowCountryList(false);
  };

  const onSubmit = (data) => {
    const { errors } = phoneSchema.validate(data);
    if (errors) {
      console.error('Validation errors:', errors);
      return;
    }
    onNext(data);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading countries...</p>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Welcome to Gemini Chat</h1>
        <p>Enter your phone number to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.phoneInputContainer}>
          <div className={styles.countrySelector} ref={dropdownRef}>
            <button
              type="button"
              className={styles.countryButton}
              onClick={() => setShowCountryList(!showCountryList)}
            >
              {selectedCountry ? (
                <div className={styles.countryInfo}>
                  <span className={styles.flag}>{selectedCountry.flag}</span>
                  <span className={styles.dialCode}>{selectedCountry.dial_code}</span>
                </div>
              ) : (
                <span>Select Country</span>
              )}
              <span className={styles.dropdownArrow}>▼</span>
            </button>

            {showCountryList && (
              <div className={styles.countryList}>
                <div className={styles.countrySearch}>
                  <input
                    type="text"
                    placeholder="Search countries..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className={styles.countryOptions}>
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      className={styles.countryOption}
                      onClick={() => handleCountrySelect(country)}
                    >
                      <span className={styles.flag}>{country.flag}</span>
                      <span className={styles.countryName}>{country.name}</span>
                      <span className={styles.dialCode}>{country.dial_code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            type="tel"
            placeholder="Phone number"
            className={styles.phoneInput}
            {...register('phoneNumber', {
              required: 'Phone number is required',
              pattern: {
                value: /^\d{10,15}$/,
                message: 'Phone number must be 10-15 digits'
              }
            })}
          />
        </div>

        {errors.phoneNumber && (
          <p className={styles.error}>{errors.phoneNumber.message}</p>
        )}

        <button type="submit" className={styles.submitButton}>
          Send OTP
        </button>
      </form>

      <div className={styles.footer}>
        <p>We'll send you a verification code</p>
      </div>
    </div>
  );
};

export default PhoneInput;
