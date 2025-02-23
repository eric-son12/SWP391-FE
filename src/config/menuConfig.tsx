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
      label: "Patient Profile",
      key: "profile",
      subItems: [
        {
          label: "Personal Profile",
          key: "personal-profile"
        },
        {
          label: "Child Profile",
          key: "child-profile"
        }
      ]
    },
    {
      icon: <Feedback />,
      label: "Post-Vaccine Reactions",
      key: "post-vaccine-reactions",
    },
    {
      icon: <Event />,
      label: "Vaccination Schedule",
      key: "vaccination-schedule",
    },
    {
      icon: <History />,
      label: "Vaccination History",
      key: "vaccination-history",
    },
  ],
  staff: [
    {
      icon: <AssignmentInd />,
      label: "Patient Management",
      key: "patient-management",
      subItems: [
        {
          label: "Patient - Parent",
          key: "patient-parent"
        },
        {
          label: "Patient - Children",
          key: "patient-children"
        }
      ]
    },
    {
      icon: <Event />,
      label: "Manage Bookings",
      key: "manage-bookings",
    },
    {
      icon: <Feedback />,
      label: "Manage Feedback",
      key: "manage-feedback",
    },
    {
      icon: <MedicalServices />,
      label: "Manage Services",
      key: "manage-services",
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
      label: "Manage Staff",
      key: "manage-staff",
    },
    {
      icon: <Inventory />,
      label: "Product List",
      key: "product-list",
    },
    {
      icon: <People />,
      label: "Client List",
      key: "client-list",
    },
    {
      icon: <Feedback />,
      label: "Feedback & Ratings",
      key: "feedback-list",
    },
  ],
};
