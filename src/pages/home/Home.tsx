import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

import { UserRole } from "../../models/user";
import { menuItemsByRole } from "../../config/menuConfig";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Sidebar from "../../components/sidebar/Sidebar";
import UserManagement from "../../components/management/UsersManagement";
import FeedbackList from "../../components/feedback/FeedbackList";
import BookingList from "../../components/booking/BookingList";
import Dashboard from "../../components/dashboard/Dashboard";
import VaccineList from "../../components/vaccine/VaccineList";
import PatientList from "../../components/patient/PatientList";
import StaffManagement from "../../components/management/StaffManagement";

const MainScreen = styled(Box)({
  flexGrow: 1, 
  padding: "1rem", 
  background: "#fff", 
  margin: "1rem 1rem 1rem 0", 
  borderRadius: "1rem",
  minHeight: "100%"
});

const DashboardLayout: React.FC = () => {
  const role: UserRole = UserRole.ADMIN;

  const defaultScreen = menuItemsByRole[role][0].subItems ? menuItemsByRole[role][0].subItems[0].key : menuItemsByRole[role][0].key;

  const [activeScreen, setActiveScreen] = useState<string>(defaultScreen);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelect = (key: string) => {
    console.log("key: ", key);
    setActiveScreen(key);
  };

  const renderCurrentPage = () => {
    switch (activeScreen) {
      case "dashboard":
        return <Dashboard />;
      case "patients":
        return <PatientList />;
      case "bookings":
        return <BookingList />;
      case "vaccines":
        return <VaccineList />;
      case "feedback":
        return <FeedbackList />;
      case "users-management":
        return <UserManagement />;
      case "staff-management":
        return <StaffManagement />;
    }
  };

  return (
    <>
      <Header />

      <Box sx={{ display: "flex", height: "calc(100vh - 74px)" }}>
        <Sidebar open={sidebarOpen} onToggle={toggleSidebar} onSelect={handleSelect} role={role}/>
        <MainScreen>
          {renderCurrentPage()}
        </MainScreen>
      </Box>

      {/* <Footer /> */}
    </>
  );
};

export default DashboardLayout;
