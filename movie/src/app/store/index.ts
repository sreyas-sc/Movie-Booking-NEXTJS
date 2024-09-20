
// for state management
import { configureStore, createSlice } from "@reduxjs/toolkit";
// createSlice creates an objects  that holds the state of the application
// it also holds the reducers that will be used to update the state

// for user
const userSlice = createSlice({
  name: "user",
  initialState: { isLoggedIN: false },
  reducers: {
    login(state) {
      state.isLoggedIN = true;
      // state.userId = action.payload.userId; // Save userId in state
    },
    logout(state) {
      localStorage.removeItem("userId")    //to remove the user id from the local storage
      state.isLoggedIN = false;
    },
  },
});

// for admin
const adminSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIN: false },
  reducers: {
    login(state) {
      state.isLoggedIN = true;
    },
    logout(state) {
      state.isLoggedIN = false;
      localStorage.removeItem("adminId");   //to remove the admin id from the local storage
      localStorage.removeItem("token");     //to remove the token from the local storage
    },
  },
});

export const userActions = userSlice.actions;
export const adminActions = adminSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    auth: adminSlice.reducer,
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
