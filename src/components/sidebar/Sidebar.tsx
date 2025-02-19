import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import {
  Person,
  Event,
  History,
  Feedback,
  Inventory,
  People,
  Dashboard,
  MedicalServices,
  AssignmentInd,
} from "@mui/icons-material";
import { UserRole } from "../../store/profile";

interface SidebarProps {
  onSelect: (key: string) => void;
  role?: "customer" | "staff" | "admin";
}

interface MenuItem {
  icon: JSX.Element;
  label: string;
  key: string;
}

const SidebarContainer = styled(Box)({
  width: 240,
  flexShrink: 0,
  backgroundColor: "#fff",
  borderRight: "1px solid #ddd",
  height: "100vh",
  padding: 16,
});

const Sidebar: React.FC<SidebarProps> = ({ onSelect, role = "customer" }) => {
  const menuItems: Record<UserRole, MenuItem[]> = {
    customer: [
      { icon: <Person />, label: "Hồ sơ bệnh nhân", key: "profile", },
      { icon: <Feedback />, label: "Phản ứng sau tiêm", key: "post-vaccine-reactions", },
      { icon: <Event />,label: "Lịch tiêm chủng",key: "vaccination-schedule",},
      { icon: <History />, label: "Lịch sử tiêm chủng", key: "vaccination-history", },
    ],
    staff: [
      { icon: <AssignmentInd />, label: "Cập nhật hồ sơ bệnh nhân", key: "update-patient-profile", },
      { icon: <Event />, label: "Quản lý lịch booking", key: "manage-bookings", },
      { icon: <Feedback />, label: "Quản lý feedback", key: "manage-feedback", },
      { icon: <MedicalServices />, label: "Quản lý dịch vụ tiêm chủng", key: "manage-services", },
      { icon: <Person />, label: "Quản lý hồ sơ khách hàng", key: "manage-client-records", },
    ],
    admin: [
      { icon: <Dashboard />, label: "Dashboard", key: "dashboard", },
      { icon: <People />, label: "Quản lý staff", key: "manage-staff", },
      { icon: <Inventory />, label: "Danh sách sản phẩm", key: "product-list", },
      { icon: <People />, label: "Danh sách khách hàng", key: "client-list", },
      { icon: <Feedback />, label: "Danh sách feedback, rating", key: "feedback-list", },
    ],
  };

  const selectedMenu = menuItems[role];

  return (
    <SidebarContainer>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {selectedMenu.map((item) => (
          <Box
            key={item.key}
            sx={{ display: "flex", alignItems: "center", gap: 2, cursor: "pointer", p: 1 }}
            onClick={() => onSelect(item.key)}
          >
            {item.icon}
            <Typography>{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;