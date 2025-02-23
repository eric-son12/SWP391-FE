import {
  HashRouter as Router,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import theme from "./theme";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AuthPage from "./pages/auth/AuthPage";

import "./App.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import Loading from "./components/loading/Loading";
import { useStore } from "./store";
import { useMemo } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  const user = useStore((store) => store.profile.user);

  const role = useMemo(() => {
    return user?.role || localStorage.getItem("role");
  }, [user]);

  const isAuthenticated = !!localStorage.getItem("token");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthPage />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "dashboard",
      element: (
        <ProtectedRoute
          isAllowed={ 
            // isAuthenticated
            true
          }
          redirectPath="/login"
        >
          <Home />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />
      <Loading />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
