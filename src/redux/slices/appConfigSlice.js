import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk(
  "user/getMyInfo",
  async () => {
    try {
      // thunkAPI.dispatch(setLoading(true)); //calling the loading before the api is called..to display loader at the top .using ThunkAPI you can dispatch other actions also like calling loader along with calling getMyInfo api
      const response = await axiosClient.get("/user/getMyInfo"); //from axiosClient take the base url followed by this url
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    } 
  }
);

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (body) => {
    try {
      const response = await axiosClient.put("/user/", body); //from axiosClient take the base url followed by this url(post the bio,image for profile to backend when updating in frontend)
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    } 
  }
);

const appConfigSlice = createSlice({
  name: "appConfigSlice",
  initialState: {
    isLoading: false,
    toastData:{},
    myProfile: null, //crating object to store my profile data we fetched using thunk
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast:(state,action) =>{
      state.toastData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyInfo.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      });
  },
});

export default appConfigSlice.reducer;

export const { setLoading,showToast } = appConfigSlice.actions;
