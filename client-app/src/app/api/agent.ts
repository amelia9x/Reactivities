import axios, { AxiosResponse } from 'axios'
import { Activity } from '../models/activity'

axios.defaults.baseURL = 'http://localhost:5000/api'

const responseBody = <T> (res: AxiosResponse<T>) => res.data

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

axios.interceptors.response.use(async (response) => {
  try {
    await sleep(200);
    return response
  } catch(err) {
    console.log(err)
    return await Promise.reject(err)
  }
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