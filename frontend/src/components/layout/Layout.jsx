import React, { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "../Sidebar";
import Navbar from "../navbar";
import { Toaster } from "../ui/sooner";
import useWebSocket from "@/hooks/useWebSocket";

export function Layout({ children }) {
  const { currentUser } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);

  const onInvite = useCallback((notification) => {
    setNotifications((prev) => [...prev, notification]);
  }, []);

  const onDelete = useCallback((notificationToDelete) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== notificationToDelete.id)
    );
  }, []);
  const token = useMemo(() => currentUser?.token, [currentUser]);

  useWebSocket(token, onInvite, onDelete);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <Toaster position="top-right" />
        <SidebarInset>
          <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <Navbar
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 dark:bg-slate-900">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
