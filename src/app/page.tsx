"use client"
import React, { useMemo } from "react";
import { BrowserRouter, useRoutes, Navigate } from "react-router-dom";
import { useStore } from "@/store";
import AuthPage from "./auth/page";
import ProtectedRoute from "@/utils/ProtectedRoute";
import DashboardPage from "@/app/(dashboard)/dashboard/page";
import Loading from "@/components/Loading";

const AppRoutes = () => {
  const user = useStore((store) => store.profile.user);
  const role = useMemo(() => user?.role, [user]);
  const isAuthenticated = !!user?.token;

  const routes = [
    {
      path: "/",
      element: isAuthenticated && (role === "ROLE_STAFF" || role === "ROLE_ADMIN") ? <Navigate to="/dashboard" /> : <AuthPage />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute
          isAllowed={isAuthenticated && (role === "ROLE_STAFF" || role === "ROLE_ADMIN")}
          redirectPath="/"
        >
          <DashboardPage />
        </ProtectedRoute>
      ),
    },
  ];

  return useRoutes(routes);
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Loading />
    </BrowserRouter>
  );
}

export default App;