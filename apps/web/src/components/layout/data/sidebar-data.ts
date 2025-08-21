import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconNotification,
  IconPackage,
  IconPalette,
  IconReceipt2,
  IconServerOff,
  IconSettings,
  IconTags,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers
} from "@tabler/icons-react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: IconLayoutDashboard,
        },
        {
          title: "Categories",
          url: "/admin/categories",
          icon: IconTags,
        },
        {
          title: "Users",
          url: "/admin/users",
          icon: IconUsers,
        },
        {
          title: "Orders",
          url: "/admin/orders",
          icon: IconReceipt2,
        },
        {
          title: "Parcels",
          url: "/admin/parcels",
          icon: IconPackage,
        },
        {
          title: "Products",
          url: "/admin/products",
          icon: IconPackage,
        },
      ],
    },
    {
      title: "Pages",
      items: [
        {
          title: "Auth",
          icon: IconLockAccess,
          items: [
            { title: "Sign In", url: "/sign-in" },
            { title: "Sign In (2 Col)", url: "/sign-in-2" },
            { title: "Sign Up", url: "/sign-up" },
            { title: "Forgot Password", url: "/forgot-password" },
            { title: "OTP", url: "/otp" },
          ],
        },
        {
          title: "Errors",
          icon: IconBug,
          items: [
            { title: "Unauthorized", url: "/401", icon: IconLock },
            { title: "Forbidden", url: "/403", icon: IconUserOff },
            { title: "Not Found", url: "/404", icon: IconError404 },
            { title: "Internal Server Error", url: "/500", icon: IconServerOff },
            { title: "Maintenance Error", url: "/503", icon: IconBarrierBlock },
          ],
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: IconSettings,
          items: [
            { title: "Profile", url: "/settings", icon: IconUserCog },
            { title: "Account", url: "/settings/account", icon: IconTool },
            { title: "Appearance", url: "/settings/appearance", icon: IconPalette },
            { title: "Notifications", url: "/settings/notifications", icon: IconNotification },
            { title: "Display", url: "/settings/display", icon: IconBrowserCheck },
          ],
        },
        {
          title: "Help Center",
          url: "/help-center",
          icon: IconHelp,
        },
      ],
    },
  ],
};
