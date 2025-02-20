import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { UserRole } from "../../models/user";
import { MenuItem, menuItemsByRole } from "../../config/menuConfig";

interface SidebarProps {
  onSelect: (key: string) => void;
  role?: UserRole;
}

const SidebarContainer = styled(Box)({
  width: 240,
  flexShrink: 0,
  backgroundColor: "#fff",
  borderRight: "1px solid #ddd",
  height: "100vh",
  padding: 16,
  margin: "1rem",
  borderRadius: "1rem",
});

const SubMenuItemContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 2,
  cursor: "pointer",
  paddingLeft: 32,
  paddingTop: 4,
  paddingBottom: 4,
});

const Sidebar = ({ onSelect, role = UserRole.CUSTOMER }: SidebarProps) => {
  const menuItems = menuItemsByRole[role];

  const renderSubMenuItem = (subItem: MenuItem) => (
    <SubMenuItemContainer
      key={subItem.key}
      onClick={() => onSelect(subItem.key)}
    >
      {subItem.icon}
      <Typography sx={{ fontSize: 14 }}>{subItem.label}</Typography>
    </SubMenuItemContainer>
  );

  const renderMenuItem = (item: MenuItem) => {
    return (
      <Box key={item.key}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            p: 1,
          }}
          onClick={() => onSelect(item.key)}
        >
          {item.icon}
          <Typography sx={{ fontSize: 14 }}>{item.label}</Typography>
        </Box>

        {item.subItems && item.subItems.length > 0 && (
          <Box sx={{ marginLeft: 2 }}>
            {item.subItems.map((subItem) => renderSubMenuItem(subItem))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <SidebarContainer>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {menuItems.map((item: MenuItem) => renderMenuItem(item))}
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;