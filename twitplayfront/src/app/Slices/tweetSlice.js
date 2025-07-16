/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { axiosInstance } from "../../helpers/axios.helper";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: null,
};

// Thunks
export const createTweet = createAsyncThunk("tweet/createTweet", async ({ data }) => {
  try {
    const response = await axiosInstance.post(`/tweets`, data);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
    throw error;
  }
});

export const getTweet = createAsyncThunk("tweet/getTweet", async (userId) => {
  try {
    const response = await axiosInstance.get(`/tweets/users/${userId}`);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
    throw error;
  }
});

export const getAllTweets = createAsyncThunk("tweet/getAllTweets", async () => {
  try {
    const response = await axiosInstance.get(`/tweets`);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
    throw error;
  }
});

export const updateTweet = createAsyncThunk("tweet/updateTweet", async ({ tweetId, data }) => {
  try {
    const response = await axiosInstance.patch(`/tweets/${tweetId}`, data);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
    throw error;
  }
});

export const deleteTweet = createAsyncThunk("tweet/deleteTweet", async ({ tweetId }) => {
  try {
    const response = await axiosInstance.delete(`/tweets/${tweetId}`);
    toast.success(response.data.message);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    console.log(error);
    throw error;
  }
});

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {
    // 👇 This handles like/dislike count update in state
    updateTweetLikeStatus: (state, action) => {
      const { tweetId, isLiked, totalLikes, isDisLiked, totalDisLikes } = action.payload;
      const tweet = state.data?.find((t) => t._id === tweetId);
      if (tweet) {
        tweet.isLiked = isLiked;
        tweet.totalLikes = totalLikes;
        tweet.isDisLiked = isDisLiked;
        tweet.totalDisLikes = totalDisLikes;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // create tweet
      .addCase(createTweet.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload);
        state.status = true;
      })
      .addCase(createTweet.rejected, (state) => {
        state.loading = false;
        state.status = false;
      })

      // get User tweet
      .addCase(getTweet.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = true;
      })
      .addCase(getTweet.rejected, (state) => {
        state.loading = false;
        state.status = false;
      })

      // get All tweets
      .addCase(getAllTweets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = true;
      })
      .addCase(getAllTweets.rejected, (state) => {
        state.loading = false;
        state.status = false;
      })

      // Update tweet
      .addCase(updateTweet.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(updateTweet.rejected, (state) => {
        state.loading = false;
        state.status = false;
      })

      // delete tweet
      .addCase(deleteTweet.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.loading = false;
        let filteredTweets = state.data.filter((tweet) => tweet._id !== action.payload._id);
        state.data = filteredTweets;
        state.status = true;
      })
      .addCase(deleteTweet.rejected, (state) => {
        state.loading = false;
        state.status = false;
      });
  },
});

// 👇 Export this so you can dispatch it in likeSlice or components
export const { updateTweetLikeStatus } = tweetSlice.actions;

export default tweetSlice.reducer;
