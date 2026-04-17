const dateUtils = {
  // Get the current date in the format YYYY-MM-DD
  getCurrentDate: () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Format a date object to a custom date string
  formatDate: (dateObject, format = 'YYYY-MM-DD') => {
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    format = format.replace('YYYY', year);
    format = format.replace('MM', month);
    format = format.replace('DD', day);

    return format;
  },

  formatDateMonth: (dateObject) => {
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = dateObject.toLocaleString('en-US', { month: 'short' });
    const year = dateObject.getFullYear();

    return `${day}-${month}-${year}`;
  },
  formatTime: (dateObject) => {
    let hours = dateObject.getHours();
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // handle 12 AM / 12 PM

    hours = String(hours).padStart(2, '0');

    return `${hours} : ${minutes} ${ampm}`;
  },

  // Add days to a given date
  addDays: (dateObject, days) => {
    const newDate = new Date(dateObject);
    newDate.setDate(dateObject.getDate() + days);
    return newDate;
  },

  // Calculate the difference in days between two dates
  dateDifferenceInDays: (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    return diffDays;
  },

  // Check if a date is in the past
  isPastDate: dateObject => {
    const currentDate = new Date();
    return dateObject < currentDate;
  },

  // Check if a date is in the future
  isFutureDate: dateObject => {
    const currentDate = new Date();
    return dateObject > currentDate;
  },
  formatTimestampToTime: timestamp => {
    const date = new Date(timestamp);
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  },

  // Format timestamp to relative time (e.g., "5h ago", "2 min ago")
  getTimeAgo: (timestamp) => {
    if (!timestamp) return '';

    // Handle Firestore Timestamp objects
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
      return 'now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}${minutes === 1 ? 'm' : 'm'} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}${hours === 1 ? 'h' : 'h'} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}${days === 1 ? 'd' : 'd'} ago`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks}${weeks === 1 ? 'w' : 'w'} ago`;
    }

    const months = Math.floor(days / 30);
    return `${months}${months === 1 ? 'mo' : 'mo'} ago`;
  },
};

export default dateUtils;
