import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  bookings: [],
  jobs: []
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload.user };
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.bookings = null;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload.jobs;
    },
    setReviews: (state, action) => {
      if (state.reviews === undefined) {
        state.reviews = []
      }
      state.reviews = action.payload.reviews
    },
    setBookings: (state, action) => {
      state.bookings = action.payload.bookings;
    },
    setBooking: (state, action) => {
      const updatedBookings = state.bookings.map((booking) => {
        if (booking.id === action.payload.booking.id) return action.payload.booking;
        return booking;
      });
      state.bookings = updatedBookings;
    },
  },
});

export const { setMode, setLogin, setLogout, setBookings, setBooking, setJobs, updateUser, setReviews } =
  authSlice.actions;
export default authSlice.reducer;
