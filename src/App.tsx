import {
  HashRouter as Router,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import theme from "./theme";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";

import "./App.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import Loading from "./components/loading/Loading";
import { useStore } from "./store";
import { useMemo } from "react";

function App() {
  const user = useStore((store) => store.profile.user);

  const role = useMemo(() => {
    return user?.role || localStorage.getItem("role");
  }, [user]);

  const isAuthenticated = !!localStorage.getItem("token");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "admin/dashboard",
      element: (
        <ProtectedRoute
          isAllowed={
            isAuthenticated &&
            (role === "ROLE_VOLUNTEER" || role === "ROLE_ADMIN")
          }
          redirectPath="/"
        >
          <p></p>
          {/* <Dashboard /> */}
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <Loading />
    </ThemeProvider>
  );
}

export default App;
