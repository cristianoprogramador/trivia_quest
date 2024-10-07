import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { GamePage } from "./pages/game";

export function ProjectRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}
