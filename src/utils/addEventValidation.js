import * as Yup from 'yup';

export const addEventSchema = Yup.object().shape({
    title: Yup.string()
        .trim()
        .required('Event title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters'),

    description: Yup.string()
        .max(500, 'Description cannot exceed 500 characters'),

    date: Yup.string()
        .required('Please select an event date'),

    startTime: Yup.string()
        .required('Start time is required'),

    endTime: Yup.string()
        .required('End time is required'),

    location: Yup.string()
        .max(200, 'Location cannot exceed 200 characters'),

    reminder: Yup.string(),
});
