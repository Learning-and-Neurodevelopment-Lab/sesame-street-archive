import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { setupDuaPersist } from "./components/DuaPersist";
import { setupUserPersist } from "./components/UserPersist";


Amplify.configure(outputs, { ssr: true });
setupDuaPersist();
setupUserPersist();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
