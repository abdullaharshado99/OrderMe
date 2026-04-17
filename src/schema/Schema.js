
import * as yup from 'yup';
// International (German IDN) email regex:
// - Local part: Unicode letters/digits, dots, hyphens, underscores, plus, percent
// - Domain: Unicode labels separated by dots, each 2+ chars
const internationalEmailRegex =
    /^[\w.+%\-\u00C0-\u024F\u1E00-\u1EFF]+@[\w\-\u00C0-\u024F\u1E00-\u1EFF]+(\.[\w\-\u00C0-\u024F\u1E00-\u1EFF]+)+$/u;

export const loginEmailSchema = yup.object().shape({
    email: yup
        .string()
        .required('Email is required')
        .trim()
        .matches(
            internationalEmailRegex,
            'Please enter a valid email address (e.g., name@domain.com or meine-müller@müller.de)'
        ),

    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters')
        .required('Password is required')
        .matches(
            /^(?=.*[A-Z])/,
            'Password must contain at least one uppercase letter'
        )
        .matches(
            /^(?=.*[a-z])/,
            'Password must contain at least one lowercase letter'
        )
        .matches(
            /^(?=.*\d)/,
            'Password must contain at least one number'
        ),


});
export const loginPhoneNoSchema = yup.object().shape({

    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters')
        .required('Password is required')
        .matches(
            /^(?=.*[A-Z])/,
            'Password must contain at least one uppercase letter'
        )
        .matches(
            /^(?=.*[a-z])/,
            'Password must contain at least one lowercase letter'
        )
        .matches(
            /^(?=.*\d)/,
            'Password must contain at least one number'
        ),
    phoneNo: yup
        .string()
        .required('Phone number is required')
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits'),

});


export const signUpEmailSchema = yup.object().shape({
    fullName: yup
        .string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
        .trim(),

    email: yup
        .string()
        .required('Email is required')
        .trim()
        .matches(
            internationalEmailRegex,
            'Please enter a valid email address (e.g., name@domain.com or meine-müller@müller.de)'
        ),

    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters')
        .matches(
            /^(?=.*[A-Z])/,
            'Password must contain at least one uppercase letter'
        )
        .matches(
            /^(?=.*[a-z])/,
            'Password must contain at least one lowercase letter'
        )
        .matches(
            /^(?=.*\d)/,
            'Password must contain at least one number'
        )
        .matches(
            /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
            'Password must contain at least one special character'
        ),

    // Confirm Password Validation
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),



});
export const signUpPhoneNoSchema = yup.object().shape({
    // Full Name Validation
    fullName: yup
        .string()
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
        .trim(),

    // Email Validation

    // Phone Number Validation (Optional)
    phoneNo: yup
        .string()
        .required('Phone number is required')
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits'),

    // Password Validation
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters')
        .matches(
            /^(?=.*[A-Z])/,
            'Password must contain at least one uppercase letter'
        )
        .matches(
            /^(?=.*[a-z])/,
            'Password must contain at least one lowercase letter'
        )
        .matches(
            /^(?=.*\d)/,
            'Password must contain at least one number'
        )
        .matches(
            /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
            'Password must contain at least one special character'
        ),

    // Confirm Password Validation
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),



});


export const forgotPasswordEmailSchema = yup.object().shape({
    email: yup.string()
        .required('Email is required')
        .trim()
        .matches(
            internationalEmailRegex,
            'Please enter a valid email address (e.g., name@domain.com or meine-müller@müller.de)'
        )
        .max(254, 'Email is too long'),
});


export const forgotPasswordPhoneSchema = yup.object().shape({
    phoneNo: yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits')
        .test(
            'starts-with',
            'Phone number must start with a valid country code',
            (value) => {
                if (!value) return false;
                // Check if starts with valid digits (customize as needed)
                return /^[1-9]/.test(value);
            }
        ),
});

export const OtpSchema = yup.object({
    otp: yup.string()
        .length(6, 'OTP must be 6 digits')
        .required('OTP is required'),
});


export const reviewEventSchema = yup.object().shape({
    title: yup
        .string()
        .required('Title is required')
        .max(100, 'Title must be less than 100 characters')
        .trim(),

    date: yup
        .string()
        .required('Date is required'),

    startTime: yup
        .string()
        .required('Start time is required'),

    endTime: yup
        .string()
        .required('End time is required'),

    location: yup
        .string()
        .max(200, 'Location must be less than 200 characters'),

    reminder: yup
        .string(),
});

export const ResetPasswordSchema = yup.object({
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .matches(
            /[A-Z]/,
            'Password must contain at least one uppercase letter'
        )
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            'Password must contain at least one special character'
        )
        .required('Password is required'),

    confirmPassword: yup
        .string()
        .oneOf(
            [yup.ref('password'), null],
            'Passwords must match'
        )
        .required('Confirm password is required'),
});

export const ChangePasswordSchema = yup.object({
    oldPassword: yup
        .string()
        .required('Old password is required'),

    newPassword: yup
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .matches(
            /[A-Z]/,
            'Password must contain at least one uppercase letter'
        )
        .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            'Password must contain at least one special character'
        )
        .notOneOf(
            [yup.ref('oldPassword')],
            'New password must be different from old password'
        )
        .required('New password is required'),

    confirmPassword: yup
        .string()
        .oneOf(
            [yup.ref('newPassword'), null],
            'Passwords must match'
        )
        .required('Confirm password is required'),
});


export const editEventSchema = yup.object().shape({
    title: yup
        .string()
        .trim()
        .required('Event title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters'),

    description: yup
        .string()
        .trim()
        .required('Description is required')
        .max(500, 'Description cannot exceed 500 characters'),

    date: yup
        .string()
        .required('Please select an event date'),

    startTime: yup
        .string()
        .required('Start time is required'),

    endTime: yup
        .string()
        .required('End time is required'),

    location: yup
        .string()
        .max(200, 'Location cannot exceed 200 characters'),

    reminder: yup.string(),
});

export const addEventSchema = yup.object().shape({
    title: yup.string()
        .trim()
        .min(3, 'Event title is too short')
        .max(100, 'Title cannot exceed 100 characters')
        .required('Event title is required'),

    description: yup.string()
        .max(500, 'Description cannot exceed 500 characters')
        .nullable(),

    date: yup.string()
        .required('Please select an event date'),

    startTime: yup.string()
        .required('Start time is required'),

    endTime: yup.string()
        .required('End time is required')
        // Custom test to ensure end time is after start time
        .test('is-after-start', 'End time must be after start time', function (value) {
            const { startTime } = this.parent;
            if (!startTime || !value) return true;

            // Basic comparison logic for HH:mm format
            // If you use AM/PM, you'll need to parse them to a 24h scale first
            return value > startTime;
        }),

    location: yup.string()
        .trim()
        .max(200, 'Location is too long')
        .required('Location is required'),

    reminder: yup.string()
        .required('Please select a reminder setting'),
});

export const editTaskSchema = yup.object().shape({
    title: yup
        .string()
        .trim()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters'),

    description: yup
        .string()
        .trim()
        .max(500, 'Description cannot exceed 500 characters'),

    priority: yup
        .string()
        .required('Priority is required')
        .oneOf(['Urgent', 'High', 'Medium', 'Low'], 'Invalid priority'),

    date: yup
        .string()
        .nullable(),

    time: yup
        .string()
        .nullable(),

    reminder: yup
        .string()
        .required('Please select a reminder'),
});
