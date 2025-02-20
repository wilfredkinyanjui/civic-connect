import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import "./index.css";
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';

const basename = import.meta.env.BASE_URL || '/';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={basename}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </BrowserRouter>
);