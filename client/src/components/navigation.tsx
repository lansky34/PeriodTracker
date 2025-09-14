import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLogout } from "../lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarHeart, Bell, Settings, User, LogOut } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const logout = useLogout();

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/calendar", label: "Calendar" },
    { path: "/symptoms", label: "Symptoms" },
    { path: "/insights", label: "Insights" },
  ];

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <CalendarHeart className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">FlowTracker</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <Bell className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-profile-menu">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-accent-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/settings">
                  <DropdownMenuItem data-testid="button-settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Desktop */}
      <nav className="bg-card border-b border-border px-4 hidden md:block">
        <div className="flex space-x-8 max-w-7xl mx-auto">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`py-3 px-1 text-sm font-medium border-b-2 border-transparent transition-colors ${
                  location === item.path || (location === "/" && item.path === "/dashboard")
                    ? "text-primary border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
        <div className="flex">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className="flex-1">
              <a
                className={`flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors ${
                  location === item.path || (location === "/" && item.path === "/dashboard")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                <div className="w-6 h-6 mb-1 flex items-center justify-center">
                  {item.label === "Dashboard" && <i className="fas fa-chart-line"></i>}
                  {item.label === "Calendar" && <i className="fas fa-calendar-alt"></i>}
                  {item.label === "Symptoms" && <i className="fas fa-notes-medical"></i>}
                  {item.label === "Insights" && <i className="fas fa-chart-bar"></i>}
                </div>
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
