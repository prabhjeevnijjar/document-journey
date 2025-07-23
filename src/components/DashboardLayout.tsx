"use client";

import * as React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemComponent,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
interface JWTPayload {
  id: number;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  iat?: number;
  exp?: number;
}
interface DashboardLayoutProps {
  user: JWTPayload | null;

  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function DashboardLayout({
  user,
  children,
  breadcrumbs = [],
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { token, setUserData } = useAuthStore();

  const authPages = ["/login", "/signup"];
  const isAuthPage = authPages.includes(pathname);
  const title =
    pathname === "/dashboard"
      ? "Dashboard"
      : pathname === "/agreements"
      ? "My Agreements"
      : pathname === "/contacts"
      ? "Contacts"
      : pathname === "/documents"
      ? "Documents"
      : "";
  useEffect(() => {
    console.log("DashboardLayout mounted with user:", user);
    if (user) {
      setUserData(user);
      console.log("User data set in store:", user);
    } else {
      console.warn("No user data provided to DashboardLayout");
    }
  }, []);
  useEffect(() => {
    console.log("DashboardLayout mounted");

    const fetchUserData = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.status === "success" && response.data.data) {
            console.log("User data fetched successfully:", response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    };
    console.log("Token:", token);
    // Only fetch if we have a token and are not on auth pages
    if (token && !isAuthPage) {
      fetchUserData();
    }
  });

  return !isAuthPage ? (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          {breadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItemComponent
                      className={index === 0 ? "hidden md:block" : ""}
                    >
                      {item.href && index < breadcrumbs.length - 1 ? (
                        <BreadcrumbLink href={item.href}>
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItemComponent>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  ) : (
    children
  );
}
