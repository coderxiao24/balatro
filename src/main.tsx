import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { setupStatusBar } from "./utils/index.ts";

setupStatusBar();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
