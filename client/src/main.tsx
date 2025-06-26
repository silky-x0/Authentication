import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx'
import ManageUser from "./Component/ManageUser.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/manage-user" element={<ManageUser />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
