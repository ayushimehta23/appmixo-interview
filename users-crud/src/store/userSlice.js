import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await axios.get(API_URL);
  return res.data;
});

export const fetchUserById = createAsyncThunk(
    "users/fetchUserById",
    async (id) => {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    }
  );

export const createUser = createAsyncThunk("users/createUser", async (user) => {
  const res = await axios.post(API_URL, user);
  return res.data;
});

export const updateUser = createAsyncThunk("users/updateUser", async (user) => {
  const res = await axios.put(`${API_URL}/${user.id}`, user);
  return res.data;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex(
          (u) => String(u.id) === String(action.payload.id)
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        } else {
          state.data.push(action.payload);
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (u) => String(u.id) === String(action.payload.id)
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (u) => String(u.id) !== String(action.payload)
        );
      });
  },
});

export default userSlice.reducer;
