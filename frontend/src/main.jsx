import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./css/CustomStyle.css";
import App from "./App.jsx";
import axios from "axios";
import { store, persistor } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./components/ThemeProvider";
import "./i18n";

axios.defaults.baseURL = "http://localhost:8000";

createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="vite-ui-theme"
        attribute="class"
        enableSystem
      >
        <App />
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
