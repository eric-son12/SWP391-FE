import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

import { UserRole } from "../../models/user";
import { menuItemsByRole } from "../../config/menuConfig";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Sidebar from "../../components/sidebar/Sidebar";
import UserProfileLayout from "../../components/profile/Profile";
import VaccineManagement from "../../components/vaccine/VaccineManagement";

const MainScreen = styled(Box)({
  flexGrow: 1, 
  padding: "1rem", 
  background: "#fff", 
  margin: "1rem 1rem 1rem 0", 
  borderRadius: "1rem" 
});

const DashboardLayout: React.FC = () => {
  const role: UserRole = UserRole.CUSTOMER;

  const defaultScreen = menuItemsByRole[role][0].key;

  const [activeScreen, setActiveScreen] = useState<string>(defaultScreen);

  const handleSelect = (key: string) => {
    setActiveScreen(key);
  };

  const renderContent = () => {
    switch (activeScreen) {
      case "profile":
        return <UserProfileLayout />;
      case "product-list":
        return <VaccineManagement />;
      default:
        return <Typography variant="h4">{activeScreen}</Typography>;
    }
  };

  return (
    <>
      <Header />

      <Box sx={{ display: "flex" }}>
        <Sidebar onSelect={handleSelect} role={role} />
        <MainScreen>
          {renderContent()}
        </MainScreen>
      </Box>

      <Footer />
    </>
  );
};

export default DashboardLayout;
