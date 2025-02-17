import React, { Suspense, useState } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import { useStore } from "../../store";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import UserProfileLayout from "../../components/profile/Profile";

const DashboardLayout: React.FC = () => {
  const user = useStore((state) => state.users?.user);
  const role = user?.role || "client";

  const [activeScreen, setActiveScreen] = useState<string>("dashboard");

  const renderContent = () => {
    switch (activeScreen) {
      case "profile":
        return <UserProfileLayout />;
      default:
        return <Typography variant="h4">{activeScreen.replace("-", " ")}</Typography>;
    }
  };

  return (
    <>
      <Header />

      <Box sx={{ display: "flex" }}>
        <Sidebar onSelect={setActiveScreen} role={role} />
        <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: "#fff" }}>
          <Container maxWidth="lg">
            <Suspense fallback={<CircularProgress />}>
              {renderContent()}
            </Suspense>
          </Container>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default DashboardLayout;