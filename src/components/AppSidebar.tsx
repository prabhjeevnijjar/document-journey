import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import axios from "axios";
import { toast } from "sonner";
// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          isActive: false,
        },
        {
          title: "Agreements",
          url: "/agreements",
          isActive: false,
        },
        {
          title: "Documents",
          url: "/documents",
          isActive: false,
        },
        {
          title: "Contacts",
          url: "/contacts",
          isActive: false,
        },
        {
          title: "Activity",
          url: "/activity",
          isActive: false,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const { token, logout: logoutStore } = useAuthStore();

  const handleLogout = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Add this line to enable credentials
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          // Clear auth store
          // logoutStore();

          toast.success("Logged out successfully");

          router.push("/login");
        }
      })
      .catch(() => {
        toast.error("Failed to logout. Please try again.");
      });
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroupLabel onClick={handleLogout}>Logout</SidebarGroupLabel>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
