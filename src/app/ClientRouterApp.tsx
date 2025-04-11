"use client";
import ProtectedRoute from "@/utils/ProtectedRoute";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./auth/page";
import DashboardPage from "./(dashboard)/dashboard/page";
import { useStore } from "@/store";

export default function ClientRouterApp() {
  const user = useStore((store) => store.profile.user);
  const role = user?.role;
  const isAuthenticated = !!user?.token;

  function Auth() {
    return isAuthenticated && (role === "STAFF" || role === "ADMIN") ? (
      <Navigate to="/dashboard" />
    ) : (
      <AuthPage />
    );
  }
  function Home() {
    return <ProtectedRoute
    isAllowed={isAuthenticated && (role === "STAFF" || role === "ADMIN")}
    redirectPath="/"
  >
    <DashboardPage />
  </ProtectedRoute>;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}