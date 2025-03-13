import { UserRole } from "@/types/menu";
import { LayoutDashboard, Users, CalendarDays, Baby, Syringe, ListChecks, Layers, BadgeCheck, FolderPlus, Bell, FileText, History, TrendingUp, MessageSquare } from "lucide-react";

export interface SubMenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  key: string;
  path?: string;
}

export interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  key: string;
  subItems?: SubMenuItem[];
  path?: string;
  onClick?: () => void;
}

export const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  ROLE_CUSTOMER: [],
  ROLE_STAFF: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      key: "dashboard",
      path: "/dashboard",
    },
    {
      label: "Patients",
      icon: Users,
      key: "patients",
      subItems: [
        { label: "Parents", icon: Users, key: "parents" },
        { label: "Children", icon: Baby, key: "children" },
      ],
    },
    {
      label: "Bookings",
      icon: CalendarDays,
      key: "bookings",
      path: "/bookings",
    },
    {
      label: "Product Management",
      icon: Syringe,
      key: "product-management",
      subItems: [
        { label: "Add Product", icon: Syringe, key: "add-product" },
        { label: "List Products", icon: ListChecks, key: "list-products" },
      ],
    },
    {
      label: "Category Management",
      icon: Layers,
      key: "category-management",
      subItems: [
        { label: "Create Category", icon: FolderPlus, key: "create-category" },
        { label: "List Categories", icon: ListChecks, key: "list-categories" },
      ],
    },
    {
      label: "Post Management",
      icon: FileText,
      key: "post-management",
      subItems: [
        { label: "Add Post", icon: FolderPlus, key: "add-post" },
        { label: "List Posts", icon: ListChecks, key: "list-posts" },
      ],
    },
    {
      label: "Feedback",
      icon: MessageSquare,
      key: "feedback",
      path: "/feedback",
    },
    {
      label: "Notifications",
      icon: Bell,
      key: "notifications",
      path: "/notifications",
    },
  ],
  ROLE_ADMIN: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      key: "dashboard",
      path: "/dashboard",
    },
    {
      label: "Management",
      icon: BadgeCheck,
      key: "management",
      subItems: [
        { label: "Users", icon: Users, key: "users-management", path: "/users-management" },
        { label: "Staff", icon: BadgeCheck, key: "staff-management", path: "/staff-management" },
        { label: "Roles & Permissions", icon: BadgeCheck, key: "roles-management", path: "/roles-management" },
      ],
    },
    {
      label: "Vaccines",
      icon: Syringe,
      key: "vaccines",
      path: "/vaccines",
    },
    {
      label: "Feedback",
      icon: MessageSquare,
      key: "feedback",
      path: "/feedback",
    },
    // {
    //   label: "Reports",
    //   icon: FileText,
    //   key: "reports",
    //   subItems: [
    //     { label: "Daily Orders", icon: History, key: "daily-orders" },
    //     { label: "Top Vaccine", icon: Syringe, key: "top-vaccine" },
    //     { label: "Revenue", icon: TrendingUp, key: "revenue" },
    //     { label: "Vaccinated Age", icon: Baby, key: "vaccinated-age" },
    //   ],
    // },
    // {
    //   label: "Notifications",
    //   icon: Bell,
    //   key: "notifications",
    //   path: "/notifications",
    // },
  ],
};
