import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  BookOpen,
  User,
  Settings,
  FileQuestion,
  BookOpenText,
  FileText,
  Trophy,
  Bot,
} from "lucide-react";
import { Button } from "./ui/button";
import React from "react";
import { cn } from "@/components/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AppSidebar = React.memo(() => {
  const { t } = useTranslation();
  const items = [
    { icon: Home, label: t("sidebar.home"), href: "/home" },
    { icon: Trophy, label: t("sidebar.leaderboard"), href: "/leaderboard" },
    { icon: BookOpen, label: t("sidebar.practice"), href: "/practice" },
    { icon: FileQuestion, label: t("sidebar.questions"), href: "/questions" },
    { icon: BookOpenText, label: t("sidebar.exams"), href: "/exams" },
    { icon: User, label: t("sidebar.users"), href: "/users" },
    { icon: FileText, label: t("sidebar.resources"), href: "/resources" },
    {
      icon: Bot,
      label: t("sidebar.aiService"),
      href: "/ai-service",
    },
    { icon: Settings, label: t("sidebar.settings"), href: "/settings" },
  ];

  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  const isAdmin = currentUser?.role.some((r) => r.name === "ROLE_ADMIN");
  const isTeacher = currentUser?.role.some((r) => r.name === "ROLE_TEACHER");

  return (
    <Sidebar>
      <SidebarContent className={"dark:bg-slate-900"}>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold py-7 mb-1 text-purple-800 select-none dark:text-white">
            SmartQuiz
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.includes(item.href);
                if (item.icon === User && !isAdmin) {
                  return null;
                } else if (item.icon === Bot && !isAdmin) {
                  return null;
                } else if (item.icon === FileText && !isAdmin) {
                  return null;
                } else {
                  if (item.icon === FileQuestion && !(isAdmin || isTeacher)) {
                    // || item.icon === BookOpenText
                    return null;
                  }
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className="h-10"
                      isActive={isActive}
                    >
                      <Link to={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start cursor-pointer ",
                            isActive &&
                              "bg-[--sidebar-active-bg] text-[--sidebar-active-fg] hover:bg-[--sidebar-active-bg] hover:text-[--sidebar-active-fg]"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "mr-1 h-5 w-5",
                              isActive && "text-purple-800 dark:text-white"
                            )}
                          />
                          <span
                            className={
                              isActive
                                ? "text-purple-800 dark:text-white  dark:font-bold"
                                : ""
                            }
                          >
                            {item.label}
                          </span>
                        </Button>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
});

export { AppSidebar };
