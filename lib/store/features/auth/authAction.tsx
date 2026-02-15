
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { updateUser } from "../user/userSlice";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }: any, { dispatch, rejectWithValue }) => {
    try {
      // const response = (await HttpService.Post<loginInput>(
      //   API_ENDPOINTS.LOGIN,
      //   { email, password, isOperator: true }
      // )) as AxiosResponse<any>;

      // dispatch(
      //   updateUser({ user: response.data.user, token: response.data.token })
      // );

      // return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
