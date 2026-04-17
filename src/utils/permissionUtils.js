import {
  RESULTS,
  request,
  requestMultiple,
  requestNotifications,
  requestLocationAccuracy,
} from 'react-native-permissions';

const handlePermission = result => {
  let isPermitted = false;
  switch (result) {
    case RESULTS.UNAVAILABLE:
      console.warn(
        'This feature is not available (on this device / in this context)',
      );
      break;
    case RESULTS.DENIED:
      console.warn(
        'The permission has not been requested / is denied but requestable',
      );
      break;
    case RESULTS.LIMITED:
      console.log(
        '[Test]',
        'The permission is limited: some actions are possible',
      );
      isPermitted = true;
      break;
    case RESULTS.GRANTED:
      console.log('[Test]', 'The permission is granted');
      isPermitted = true;
      break;
    case RESULTS.BLOCKED:
      console.warn('The permission is denied and not requestable anymore');
      break;
  }
  return isPermitted;
};

const permissionUtils = {
  getSinglePermission: async permission => {
    let isPermitted = false;
    try {
      const result = await request(permission);
      return handlePermission(result);
    } catch (error) {
      //handle error
      return isPermitted;
    }
  },
  getMultiplePermission: async permissions => {
    let isPermitted = false;

    try {
      const results = await requestMultiple(permissions);

      // Check each permission result
      for (let i = 0; i < permissions.length; i++) {
        isPermitted = handlePermission(results[permissions[i]]) || isPermitted;
      }

      return isPermitted;
    } catch (error) {
      // Handle error
      return isPermitted;
    }
  },
  requestNotificationPermission: async () => {
    try {
      const {status} = await requestNotifications(['alert', 'badge', 'sound']);

      if (
        status === 'denied' ||
        status === 'blocked' ||
        status === 'unavailable'
      ) {
        // ask user to allow permission from app setting by using alert or toast
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  },
  //only for ios
  requestLocationAccuracyPermission: async () => {
    try {
      const accuracy = await requestLocationAccuracy({
        purposeKey:
          'Need to fetch your location to show active route between two points',
      });
      console.log('[Test]', `Location accuracy is: ${accuracy}`);
      if (
        accuracy === 'denied' ||
        accuracy === 'blocked' ||
        accuracy === 'unavailable'
      ) {
        // ask user to allow permission from app setting by using alert or toast
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

export default permissionUtils;
