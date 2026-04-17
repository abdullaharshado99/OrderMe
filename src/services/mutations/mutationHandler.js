import useApi from ".";


export const mutationHandler = (
  url,
  userToken,
  whenSuccess,
  whenError,
  method,
) => {

  console.log("url ==>" , url);
  

  return useApi(url, userToken, {}, whenSuccess, whenError, method);
};
