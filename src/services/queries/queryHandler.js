import { useSelector } from 'react-redux';
import useQueryApi from './useQueryApi';

const queryHandler = (url, enabled) => {
  const userToken = useSelector(state => state?.user?.user?.accessToken);
  return useQueryApi(['mainData', url], url, userToken, {}, enabled);
};

export default queryHandler;
