import axios, { AxiosError, AxiosResponse } from 'axios'
import { Activity } from '../models/activity'
import { toast } from 'react-toastify'

axios.defaults.baseURL = 'http://localhost:5000/api'

const responseBody = <T> (res: AxiosResponse<T>) => res.data

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

axios.interceptors.response.use(async (response) => {
  await sleep(200);
  return response
}, (error: AxiosError) => {
  const {data, status} = error.response!;
  switch(status) {
    case 400:
      toast.error("Bad request")
      break
    case 401:
      toast.error("Unauthorized")
      break
    case 403:
      toast.error("Forbidden")
      break
    case 404:
      toast.error("Not found")
      break
    case 500:
      toast.error("Server error")
      break
  }
  return Promise.reject(error)
})

const requests = {
  get: <T> (url: string) => axios.get<T>(url).then(responseBody),
  put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  getActivity: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post<void>("/activities", activity),
  edit: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity), 
  delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent = {
  Activities
}

export default agent