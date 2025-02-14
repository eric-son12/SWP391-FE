import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Sidebar from "../../components/sidebar/Sidebar";
import { useStore } from "../../store";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const DashboardLayout: React.FC = () => {
  const user = useStore((state) => state.users?.user);
  const role = user?.role || "client";

  const [activeScreen, setActiveScreen] = useState<string>("dashboard");

  return (
    <>
      <Header />

      <Box sx={{ display: "flex" }}>
        <Sidebar onSelect={setActiveScreen} role={role} />
        <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f5f5f5" }}>
          <Container maxWidth="lg">
            <Typography variant="h4">{activeScreen.replace("-", " ")}</Typography>
          </Container>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default DashboardLayout;