import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// Define a type for the slice state
interface UserState {
  user: any;
  token: string | null;
  loading: boolean;
  error: any;
  permissions: any;
  role : any
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  permissions: [],
  role:{}
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getCurrentUser.pending, (state) => {
  //     state.loading = true;
  //     state.error = null;
  //   });
  //   builder.addCase(getCurrentUser.fulfilled, (state, { payload }) => {
  //     state.loading = false;
  //     state.user = payload.data?.result ? payload.data?.result : payload?.data;
  //     state.permissions = payload.data?.role?.permissions
  //   });
  //   builder.addCase(getCurrentUser.rejected, (state, { payload }: any) => {
  //     state.loading = false;
  //     state.error = payload?.response?.data?.error;
  //   });
  // },
});

export const { updateUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
