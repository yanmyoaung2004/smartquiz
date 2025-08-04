import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  question: null,
  error: null,
  loading: false,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestionForEdit: (state, action) => {
      state.question = action.payload;
      state.error = null;
    },
    removeQuestionForEdit: (state) => {
      state.question = null;
      state.error = null;
    },
  },
});

export const { setQuestionForEdit, removeQuestionForEdit } =
  questionSlice.actions;

export default questionSlice.reducer;
