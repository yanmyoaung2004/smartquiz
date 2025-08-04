import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exam: null,
  examDetail: null,
  invitedEmailUser: null,
  examCode: null,
  error: null,
  loading: false,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExamCode: (state, action) => {
      state.examCode = action.payload;
      state.error = null;
    },
    removeExamCode: (state) => {
      state.examCode = null;
      state.error = null;
    },

    setInvitedEmailUser: (state, action) => {
      state.invitedEmailUser = action.payload;
      state.error = null;
    },
    removeInvitedEmailUser: (state) => {
      state.invitedEmailUser = null;
      state.error = null;
    },

    seeExamDetailStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    seeExamDetailSuccess: (state, action) => {
      state.examDetail = action.payload;
      state.loading = false;
    },
    seeExamDetailFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create Exam
    createExamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createExamSuccess: (state) => {
      state.exam = null;
      state.loading = false;
    },
    publishExamStart: (state, action) => {
      state.exam = action.payload;
      state.loading = false;
    },
    completeDraftExam: (state, action) => {
      state.exam = action.payload;
      state.error = null;
    },
    createExamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createExamRemove: (state) => {
      state.exam = null;
      state.loading = false;
      state.error = null;
    },

    // Fetch Exam
    fetchExamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchExamSuccess: (state, action) => {
      state.exam = action.payload;
      state.loading = false;
    },
    fetchExamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update Exam
    updateExamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateExamSuccess: (state, action) => {
      state.exam = action.payload;
      state.loading = false;
    },
    updateExamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete Exam
    deleteExamStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteExamSuccess: (state) => {
      state.exam = null;
      state.loading = false;
    },
    deleteExamFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setExamCode,
  removeExamCode,

  seeExamDetailStart,
  seeExamDetailSuccess,
  seeExamDetailFailure,

  createExamStart,
  createExamSuccess,
  createExamFailure,
  createExamRemove,
  completeDraftExam,
  publishExamStart,

  fetchExamStart,
  fetchExamSuccess,
  fetchExamFailure,

  updateExamStart,
  updateExamSuccess,
  updateExamFailure,

  deleteExamStart,
  deleteExamSuccess,
  deleteExamFailure,

  setInvitedEmailUser,
  removeInvitedEmailUser,
} = examSlice.actions;

export default examSlice.reducer;
