import { UserRole } from "../models/user";
import {
  Person,
  Event,
  History,
  Feedback,
  Dashboard,
  ChildCare,
  Vaccines,
  ManageAccounts,
  Group, 
  Badge,
  People
} from "@mui/icons-material";

export interface SubMenuItem {
  icon: JSX.Element;
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
      label: "Patient",
      key: "profile",
      subItems: [
        { label: "Parents", icon: <Person />, key: "parent" },
        { label: "Children", icon: <ChildCare />, key: "children" },
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
      label: "Patients",
      icon: <People />,
      key: "patients",
      subItems: [
        { label: "Parents", icon: <Person />, key: "parent" },
        { label: "Children", icon: <ChildCare />, key: "children" },
      ],
    },
    { label: "Bookings", icon: <Event />, key: "bookings" },
    { label: "Feedback", icon: <Feedback />, key: "feedback" },

  ],
  admin: [
    { label: "Dashboard", icon: <Dashboard />, key: "dashboard" },
    {
      label: "Management",
      icon: <ManageAccounts />,
      key: "management",
      subItems: [
        { label: "Users", icon: <Group />, key: "users-management" },
        { label: "Staff", icon: <Badge />, key: "staff-management" },
      ],
    },
    { label: "Vaccines", icon: <Vaccines />, key: "vaccines" },
    { label: "Feedback", icon: <Feedback />, key: "feedback" },
  ],
};
