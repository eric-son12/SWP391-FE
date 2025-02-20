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
  ExpandMore,
  EscalatorWarning
} from "@mui/icons-material";
import { UserRole } from "../models/user";

export interface SubMenuItem {
  // icon: JSX.Element;
  label: string;
  key: string;
}

export interface MenuItem {
  icon: JSX.Element;
  label: string;
  key: string;
  subItems?: SubMenuItem[];
}

export const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  customer: [
    {
      icon: <Person />,
      label: "Hồ sơ bệnh nhân",
      key: "profile",
      subItems: [
        {
          label: "Hồ sơ cá nhân",
          key: "personal-profile"
        },
        {
          label: "Hồ sơ trẻ con",
          key: "child-profile"
        }
      ]
    },
    {
      icon: <Feedback />,
      label: "Phản ứng sau tiêm",
      key: "post-vaccine-reactions",
    },
    {
      icon: <Event />,
      label: "Lịch tiêm chủng",
      key: "vaccination-schedule",
    },
    {
      icon: <History />,
      label: "Lịch sử tiêm chủng",
      key: "vaccination-history",
    },
  ],
  staff: [
    {
      icon: <AssignmentInd />,
      label: "Cập nhật hồ sơ bệnh nhân",
      key: "update-patient-profile",
    },
    {
      icon: <Event />,
      label: "Quản lý lịch booking",
      key: "manage-bookings",
    },
    {
      icon: <Feedback />,
      label: "Quản lý feedback",
      key: "manage-feedback",
    },
    {
      icon: <MedicalServices />,
      label: "Quản lý dịch vụ",
      key: "manage-services",
    },
    {
      icon: <Person />,
      label: "Quản lý hồ sơ khách hàng",
      key: "manage-client",
    },
  ],
  admin: [
    {
      icon: <Dashboard />,
      label: "Dashboard",
      key: "dashboard",
    },
    {
      icon: <People />,
      label: "Quản lý staff",
      key: "manage-staff",
    },
    {
      icon: <Inventory />,
      label: "Danh sách sản phẩm",
      key: "product-list",
    },
    {
      icon: <People />,
      label: "Danh sách khách hàng",
      key: "client-list",
    },
    {
      icon: <Feedback />,
      label: "Danh sách feedback, rating",
      key: "feedback-list",
    },
  ],
};
