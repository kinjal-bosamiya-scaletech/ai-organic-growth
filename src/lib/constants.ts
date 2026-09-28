import { FileText, Gauge, Search, Swords, Wrench } from "lucide-react";
import type { NavItem } from "@/types/nav";

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Gauge },
  { id: "competitors", label: "Competitors", icon: Swords },
  { id: "content-generation", label: "Content Generator", icon: FileText },
  { id: "seo-analysis", label: "SEO Analysis", icon: Search },
  { id: "free-tools", label: "Tools", icon: Wrench },
];

export const MODULE_TITLES: Record<NavItem["id"], string> = {
  dashboard: "Dashboard",
  competitors: "Competitors",
  "content-generation": "Content Generator",
  "seo-analysis": "SEO Analysis",
  "free-tools": "Tools",
  settings: "Settings",
};
