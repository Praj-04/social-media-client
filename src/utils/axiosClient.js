import axios from "axios";
import store from '../redux/store'
import { setLoading, showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";
import {
  getItem,
  KEY_ACCESS_TOKEN,
  removeItem,
  setItem,
} from "./localStorageManager";



//code to choose between development or production
let baseURL = 'http://localhost:4000/';
console.log('env is',process.env.NODE_ENV);
if(process.env.NODE_ENV === 'production'){
  console.log('baseurl is',process.env.REACT_APP_SERVER_BASE_URL);
  baseURL = process.env.REACT_APP_SERVER_BASE_URL
}

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true, //send cookies also
});



//Request Interceptor
// every request from front end will add access token to itself from here and send to backend.
//The backend will check if the access token is valid. If not valid then the below response part of code will start executing
axiosClient.interceptors.request.use((request) => {
  // console.log("add access token from local storage ");
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  store.dispatch(setLoading(true));
  return request;
});

//Response Interceptor
//If the initial access token is valid,send data back to user
axiosClient.interceptors.response.use(async (response) => {
  store.dispatch(setLoading(false));
  const data = response.data;
  if (data.status === "ok") {
    return data;
  }

  //If the initial access token invalid(Backend send 401), execute below lines of response Interceptor
  const statusCode = data.statusCode;
  const originalRequest = response.config;
  const error = data.message;

  store.dispatch(showToast({
    type:TOAST_FAILURE,
    message:error
  }))

  //   // console.log(originalRequest.url);
  

  //When refresh token itself expired, direct user to login page
  // if (
  //   statusCode === 401 &&
  //   originalRequest.url ===
  //     `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
  // ) {
  //   removeItem(KEY_ACCESS_TOKEN); //refresh token expired..remove access token from storage
  //   window.location.replace("/login", "_self"); //send user to login page by reloading
  //   return Promise.reject(error);
  // }

  // if access token expired,call refresh api to generate new access code
  if (statusCode === 401 && !originalRequest._retry) {
    // console.log("inside access token regenerate");
        console.log('the url sent is',`${baseURL}/auth/refresh`)
    originalRequest._retry = true;
    const response = await axios
      .create({
        withCredentials: true,
      }).get(`${baseURL}/auth/refresh`);
      // .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);
      
      

      //if you get new access token,the server the request
    if (response.data.status === "ok") {
      setItem(KEY_ACCESS_TOKEN, response.data.result.accessToken);
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${response.data.result.accessToken}`;

      console.log(
        "token from backend after generating new access token ",
        response.data.result.accessToken
      );
      return axios(originalRequest);
    } else{
      removeItem(KEY_ACCESS_TOKEN); //if error while refreshing access token..remove access token from storage
      window.location.replace("/login", "_self"); //logout user and send user to login page by reloading
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
}, async(error)=>{
  store.dispatch(setLoading(false));

  store.dispatch(showToast({
    type:TOAST_FAILURE,
    message:error.message
  }))

  return Promise.reject(error);
});
