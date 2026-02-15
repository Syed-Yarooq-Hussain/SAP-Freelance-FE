import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./authAction";
import { RootState } from "../../store";

interface IAuthState {
  loading: boolean;
  userInfo: null | [];
  userToken: null | [];
  error: any;
  success: boolean;
}

const initialState: IAuthState = {
  loading: false,
  userInfo: null,
  userToken: null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // register user
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }:any) => {
      state.loading = false;
      state.success = true; // registration successful
      state.userInfo = payload?.data?.user;
      state.userToken = payload?.data?.token;
    });
    builder.addCase(userLogin.rejected, (state, { payload }: any) => {
      state.loading = false;
      state.error = payload?.response?.data?.error;
    });
  },
});

export const selectUser = (state: RootState) => state.user;

export default authSlice.reducer;
