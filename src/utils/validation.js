import Joi from 'joi';

// Phone number validation schema
export const phoneSchema = Joi.object({
  countryCode: Joi.string()
    .pattern(/^\+\d{1,4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please select a valid country code',
      'any.required': 'Country code is required'
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10-15 digits',
      'any.required': 'Phone number is required'
    })
});

// OTP validation schema
export const otpSchema = Joi.object({
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'OTP must be 6 digits',
      'any.required': 'OTP is required'
    })
});

// Chatroom creation validation schema
export const chatroomSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.min': 'Chatroom title cannot be empty',
      'string.max': 'Chatroom title must be less than 50 characters',
      'any.required': 'Chatroom title is required'
    })
});

// Message validation schema
export const messageSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Message cannot be empty',
      'string.max': 'Message must be less than 2000 characters',
      'any.required': 'Message content is required'
    }),
  
  type: Joi.string()
    .valid('text', 'image')
    .default('text')
});

// Validation helper function
export const validateForm = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = {};
    error.details.forEach(detail => {
      const field = detail.path[0];
      errors[field] = detail.message;
    });
    return { errors, value: null };
  }
  
  return { errors: null, value };
};
