import { configureStore, combineReducers } from "@reduxjs/toolkit";
import examReducer from "./exam/ExamSlice";
import userReducer from "./user/userSlice";
import questionReducer from "./question/questionSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  exam: examReducer,
  user: userReducer,
  question: questionReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false });
  },
});

export const persistor = persistStore(store);
