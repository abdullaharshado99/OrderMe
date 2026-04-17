import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { API_BASE_URL } from '../../config/constants'
const SERVER_URL = API_BASE_URL



const useApi = (
  urlWithOutBase,
  userToken,
  customConfig = {},
  whenSuccess,
  whenError,
  method = 'post',
  contentType = 'application/json',
) => {
  const defaultConfig = {
    method,
    baseURL: SERVER_URL,
    headers: {
      'Content-Type': contentType,
      Authorization: userToken ? `Bearer ${userToken}` : '',
    },
  }
  const config = {
    ...defaultConfig,
    ...customConfig,
  }

  const postData = async body => {

    try {
      const response = await axios.request({
        url: urlWithOutBase,
        data: body,
        ...config,
      })
      return response.data
    } catch (error) {
      console.log('error in', error, urlWithOutBase)
      const message = error?.response?.data?.message

      throw new Error(
        message || error.message || 'Something went wrong try again later.',
      )
    }
  }

  return useMutation({
    mutationFn: postData,
    onSuccess: responseData => {
      whenSuccess(responseData)
    },
    onError: err => {
      console.log('Error sending data:', err)
      whenError(err)
    },
  })
}

export default useApi
