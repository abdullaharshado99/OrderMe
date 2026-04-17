  import { max } from 'moment';
  import { Theme } from '.';
  import * as yup from 'yup';


  const emailRegex = /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
  const generalEmailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*\.[A-Za-z]{2,}$/;

  export const loginSchema = yup.object().shape({
    email: yup.string()
      .required('Email is required')
      .test('no-spaces', 'Spaces are not allowed in the email', (value) => {
        if (!value) return true;
        return !value.includes(' ');
      })
      .test('valid-format', 'Email must contain @ symbol', (value) => {
        if (!value) return true;
        return value.includes('@');
      })
      .test('single-at', 'Email must contain only one @ symbol', (value) => {
        if (!value) return true;
        return (value.match(/@/g) || []).length === 1;
      })
      .test('valid-local-part', 'Invalid email format before @', (value) => {
        if (!value) return true;
        const localPart = value.split('@')[0];
        // Local part should have at least 1 character and can contain letters, numbers, dots, hyphens, underscores, plus signs, percent signs
        return /^[a-zA-Z0-9._+%-]+$/.test(localPart) && localPart.length > 0;
      })
      .test('valid-domain', 'Invalid domain format', (value) => {
        if (!value) return true;
        const parts = value.split('@');
        if (parts.length !== 2) return false;
        const domain = parts[1];
        
        // Domain must have at least one dot and proper structure
        if (!domain.includes('.')) return false;
        
        // Domain parts separated by dots
        const domainParts = domain.split('.');
        
        // Must have at least 2 parts (e.g., example.com)
        if (domainParts.length < 2) return false;
        
        // Each part must be 1-63 characters and contain only alphanumeric and hyphens
        for (let part of domainParts) {
          if (part.length === 0 || part.length > 63) return false;
          if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(part)) return false;
        }
        
        // TLD must be at least 2 characters and contain only letters
        const tld = domainParts[domainParts.length - 1];
        if (!/^[a-zA-Z]{2,}$/.test(tld)) return false;
        
        return true;
      })
      .test('no-duplicate-tld', 'Email cannot contain duplicate TLDs (e.g., .com.com or gmail.com.gmail.com)', (value) => {
        if (!value) return true;
        const domain = value.split('@')[1];
        if (!domain) return true;
        
      
        const tldMatches = domain.match(/\.([a-zA-Z]{2,})/g);
        if (!tldMatches || tldMatches.length < 2) return true; // Valid if only one TLD
        
        // Check if there are any duplicate TLDs
        const tlds = tldMatches.map(t => t.toLowerCase());
        const uniqueTlds = new Set(tlds);
        return tlds.length === uniqueTlds.size; // True if all TLDs are unique
      })
      .matches(generalEmailRegex, 'Invalid email format. Please enter a valid email address.'),
    password: yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/^\S*$/, 'Password must not contain spaces')
      .required('Password is required'),
  });


  export const SignupSchema = yup.object().shape({
    name: yup.string()
      .required('name is required')
      .min(3, 'name must be at least 3 characters')
      .max(50, 'name must not exceed 50 characters')
      .test('no-spaces', 'Spaces are not allowed in the user name', (value) => {
        if (!value) return true; 
        return !value.includes(' '); 
      })
      .test('valid-characters', 'name can only contain letters, numbers, hyphens (-), underscores (_), and periods (.)', (value) => {
        if (!value) return true; 
        return /^[a-zA-Z0-9\-_.]+$/.test(value);
      }),
    email: yup.string()
      .required('Email is required')
      .test('no-spaces', 'Spaces are not allowed in the email', (value) => {
        if (!value) return true;
        return !value.includes(' ');
      })
      .test('valid-format', 'Email must contain @ symbol', (value) => {
        if (!value) return true;
        return value.includes('@');
      })
      .test('single-at', 'Email must contain only one @ symbol', (value) => {
        if (!value) return true;
        return (value.match(/@/g) || []).length === 1;
      })
      .test('valid-local-part', 'Invalid email format before @', (value) => {
        if (!value) return true;
        const localPart = value.split('@')[0];
        return /^[a-zA-Z0-9._+%-]+$/.test(localPart) && localPart.length > 0;
      })
      .test('valid-domain', 'Invalid domain format', (value) => {
        if (!value) return true;
        const parts = value.split('@');
        if (parts.length !== 2) return false;
        const domain = parts[1];
        if (!domain.includes('.')) return false;
        const domainParts = domain.split('.');
        if (domainParts.length < 2) return false;
        for (let part of domainParts) {
          if (part.length === 0 || part.length > 63) return false;
          if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(part)) return false;
        }
        const tld = domainParts[domainParts.length - 1];
        if (!/^[a-zA-Z]{2,}$/.test(tld)) return false;
        
        return true;
      })
      .test('no-duplicate-tld', 'Email cannot contain duplicate TLDs (e.g., .com.com or gmail.com.gmail.com)', (value) => {
        if (!value) return true;
        const domain = value.split('@')[1];
        if (!domain) return true;
        const tldMatches = domain.match(/\.([a-zA-Z]{2,})/g);
        if (!tldMatches || tldMatches.length < 2) return true; 
        const tlds = tldMatches.map(t => t.toLowerCase());
        const uniqueTlds = new Set(tlds);
        return tlds.length === uniqueTlds.size; 
      })
      .matches(generalEmailRegex, 'Invalid email format. Please enter a valid email address.'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be greater than 6 characters')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must include at least one special character')
      .matches(/[A-Z]/, 'Must include at least one capital letter')
      .matches(/[a-z]/, 'Must include at least one lowercase letter')
      .matches(/^\S*$/, 'Password must not contain spaces')
      .matches(/[0-9]/, 'Must include at least one number'),
      
      
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .matches(/^\S*$/, 'Password must not contain spaces')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),

       agree: yup.boolean()
          .oneOf([true], 'You must accept the terms'),
  });

  export const forgetpaswordSchema = yup.object().shape({
    email: yup.string()
      .required('Email is required')
      .test('no-spaces', 'Spaces are not allowed in the email', (value) => {
        if (!value) return true;
        return !value.includes(' ');
      })
      .test('valid-format', 'Email must contain @ symbol', (value) => {
        if (!value) return true;
        return value.includes('@');
      })
      .test('single-at', 'Email must contain only one @ symbol', (value) => {
        if (!value) return true;
        return (value.match(/@/g) || []).length === 1;
      })
      .test('valid-local-part', 'Invalid email format before @', (value) => {
        if (!value) return true;
        const localPart = value.split('@')[0];
        // Local part should have at least 1 character and can contain letters, numbers, dots, hyphens, underscores, plus signs, percent signs
        return /^[a-zA-Z0-9._+%-]+$/.test(localPart) && localPart.length > 0;
      })
      .test('valid-domain', 'Invalid domain format', (value) => {
        if (!value) return true;
        const parts = value.split('@');
        if (parts.length !== 2) return false;
        const domain = parts[1];
        
        // Domain must have at least one dot and proper structure
        if (!domain.includes('.')) return false;
        
        // Domain parts separated by dots
        const domainParts = domain.split('.');
        
        // Must have at least 2 parts (e.g., example.com)
        if (domainParts.length < 2) return false;
        
        // Each part must be 1-63 characters and contain only alphanumeric and hyphens
        for (let part of domainParts) {
          if (part.length === 0 || part.length > 63) return false;
          if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(part)) return false;
        }
        
        // TLD must be at least 2 characters and contain only letters
        const tld = domainParts[domainParts.length - 1];
        if (!/^[a-zA-Z]{2,}$/.test(tld)) return false;
        
        return true;
      })
      .test('no-duplicate-tld', 'Email cannot contain duplicate TLDs (e.g., .com.com or gmail.com.gmail.com)', (value) => {
        if (!value) return true;
        const domain = value.split('@')[1];
        if (!domain) return true;
        
        // Check for patterns like .com.com, .org.org, etc.
        // Extract all TLDs (parts after dots that are only letters)
        const tldMatches = domain.match(/\.([a-zA-Z]{2,})/g);
        if (!tldMatches || tldMatches.length < 2) return true; // Valid if only one TLD
        
        // Check if there are any duplicate TLDs
        const tlds = tldMatches.map(t => t.toLowerCase());
        const uniqueTlds = new Set(tlds);
        return tlds.length === uniqueTlds.size; // True if all TLDs are unique
      })
      .matches(generalEmailRegex, 'Invalid email format. Please enter a valid email address.'),
  });


  export const ResetPasswordSchema = yup.object().shape({
   

    password: yup.string()
      .required('Password is required')
      .min(6, 'Password must be greater than 6 characters')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must include at least one special character')
      .matches(/[0-9]/, 'Must include at least one number')
      .matches(/[a-z]/, 'Must include at least one lowercase letter')
      .matches(/^\S*$/, 'Password must not contain spaces')
      .matches(/[A-Z]/, 'Must include at least one capital letter')
      .test('not-same-as-old', 'New password must be different from old password', function(value) {
        const { oldPassword } = this.parent;
        if (!value || !oldPassword) return true;
        return value !== oldPassword;
      }),

    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .matches(/^\S*$/, 'Password must not contain spaces')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),

    rememberMe: yup.boolean()
      .oneOf([true], 'You must accept the terms')
      .required('Remember me is required'),
    
  });


  export const profileValidationSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters')
      .test('no-spaces', 'Spaces are not allowed in the username', (value) => {
        if (!value) return true; // Allow empty value
        return !value.includes(' '); // Return false if any space exists
      })
      .test('valid-characters', 'Username can only contain letters, numbers, hyphens (-), underscores (_), and periods (.)', (value) => {
        if (!value) return true; // Allow empty value
        // Allow alphanumeric, hyphens, underscores, and periods
        return /^[a-zA-Z0-9\-_.]+$/.test(value);
      }),
    email: yup.string()
      .required('Email is required')
      .test('no-spaces', 'Spaces are not allowed in the email', (value) => {
        if (!value) return true;
        return !value.includes(' ');
      })
      .test('valid-format', 'Email must contain @ symbol', (value) => {
        if (!value) return true;
        return value.includes('@');
      })
      .test('single-at', 'Email must contain only one @ symbol', (value) => {
        if (!value) return true;
        return (value.match(/@/g) || []).length === 1;
      })
      .test('valid-local-part', 'Invalid email format before @', (value) => {
        if (!value) return true;
        const localPart = value.split('@')[0];
        // Local part should have at least 1 character and can contain letters, numbers, dots, hyphens, underscores, plus signs, percent signs
        return /^[a-zA-Z0-9._+%-]+$/.test(localPart) && localPart.length > 0;
      })
      .test('valid-domain', 'Invalid domain format', (value) => {
        if (!value) return true;
        const parts = value.split('@');
        if (parts.length !== 2) return false;
        const domain = parts[1];
        
        // Domain must have at least one dot and proper structure
        if (!domain.includes('.')) return false;
        
        // Domain parts separated by dots
        const domainParts = domain.split('.');
        
        // Must have at least 2 parts (e.g., example.com)
        if (domainParts.length < 2) return false;
        
        // Each part must be 1-63 characters and contain only alphanumeric and hyphens
        for (let part of domainParts) {
          if (part.length === 0 || part.length > 63) return false;
          if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(part)) return false;
        }
        
        // TLD must be at least 2 characters and contain only letters
        const tld = domainParts[domainParts.length - 1];
        if (!/^[a-zA-Z]{2,}$/.test(tld)) return false;
        
        return true;
      })
      .test('no-duplicate-tld', 'Email cannot contain duplicate TLDs (e.g., .com.com or gmail.com.gmail.com)', (value) => {
        if (!value) return true;
        const domain = value.split('@')[1];
        if (!domain) return true;
        
        // Check for patterns like .com.com, .org.org, etc.
        // Extract all TLDs (parts after dots that are only letters)
        const tldMatches = domain.match(/\.([a-zA-Z]{2,})/g);
        if (!tldMatches || tldMatches.length < 2) return true; // Valid if only one TLD
        
        // Check if there are any duplicate TLDs
        const tlds = tldMatches.map(t => t.toLowerCase());
        const uniqueTlds = new Set(tlds);
        return tlds.length === uniqueTlds.size; // True if all TLDs are unique
      })
      .matches(generalEmailRegex, 'Invalid email format. Please enter a valid email address.'),
    phone: yup.string()
    .matches(/^[0-9]+$/, 'Phone must contain only digits')
      .min(8, 'Number must be at least 8 digits')
      .max(12, 'Number must be less than 12 digits')
    .required('Phone number is required'),
    
  });




  export const passwordValidationSchema = yup.object({
    oldPassword: yup
      .string()
      .required('Old password is required'),
    
    newPassword: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be greater than 6 characters')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must include at least one special character')
      .matches(/[0-9]/, 'Must include at least one number')
      .matches(/[a-z]/, 'Must include at least one lowercase letter')
      .matches(/^\S*$/, 'Password must not contain spaces')
      .matches(/[A-Z]/, 'Must include at least one uppercase letter')
      .test('not-same-as-old', 'New password must be different from old password', function(value) {
        return value !== this.parent.oldPassword;
      }),

    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .matches(/^\S*$/, 'Password must not contain spaces')
      .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
});

  export const CreateMeetupSchema = yup.object().shape({
    meetupTitle: yup.string()
      .required('Meetup title is required')
      .min(3, 'Meetup title must be at least 3 characters')
      .max(100, 'Meetup title must not exceed 100 characters'),
    hostedBy: yup.string()
      .required('Host name is required')
      .min(2, 'Host name must be at least 2 characters')
      .max(50, 'Host name must not exceed 50 characters'),
    date: yup.string()
      .required('Date is required'),
    startTime: yup.string()
      .required('Start time is required'),
    location: yup.string()
      .required('Location is required')
      .min(3, 'Location must be at least 3 characters')
      .max(200, 'Location must not exceed 200 characters'),
    description: yup.string()
      .notRequired()
      .max(1000, 'Description must not exceed 1000 characters'),
  });

 