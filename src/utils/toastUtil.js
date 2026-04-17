import Toast from 'react-native-toast-message';

const toastUtils = {
  showSuccess: async (message) => {
    Toast.show({
      type: 'success', // Custom toast type
      text2: message,      // Only message
      visibilityTime: 3000,
      autoHide: true,
    });
  },

  showError: async (message) => {
    Toast.show({
      type: 'error', // Custom toast type
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
  },

  showInfo: async (message) => {
    Toast.show({
      type: 'customToast', // Custom toast type
      text2: message,
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
    });
  },
};

export default toastUtils;
