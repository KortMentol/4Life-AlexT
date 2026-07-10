// src/utils/icons.tsx

import {
  ArrowRight,
  ArrowUp,
  Award,
  BadgePercent,
  Beaker,
  Bug,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Cpu,
  DollarSign,
  ExternalLink,
  Eye,
  Filter,
  FlaskConical,
  Gauge,
  Gift,
  Globe,
  HardDrive,
  Headphones,
  Heart,
  HeartPulse,
  Info,
  LifeBuoy,
  Lightbulb,
  Loader2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Moon,
  Move,
  Package,
  Phone,
  PieChart,
  Play,
  Plus,
  Quote,
  Scale,
  Search,
  Send,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Smartphone,
  Star,
  Sun,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";
import React from "react";

// --- КАСТОМНЫЕ ПРЕМИАЛЬНЫЕ ИКОНКИ (Zero Dependencies) ---
// ИСПРАВЛЕНИЕ: Настоящие контурные SVG брендов (сетка 24x24, strokeWidth="2")
const Telegram = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M21.5 2L2 11.5l6.5 3L21.5 2z" />
    <path d="M21.5 2L8.5 14.5v5l3.5-3.5 4.5 4L21.5 2z" />
  </svg>
);

const WhatsApp = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M17 14c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.5c-.9-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4-.1-.5s-.7-1.7-.9-2.2c-.3-.6-.5-.5-.7-.5h-.5c-.2 0-.5.1-.7.4s-1 1-1 2.4c0 1.5 1.1 2.9 1.2 3.1.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
  </svg>
);

// [ЕДИНАЯ ТОЧКА ИСТИНЫ] Централизованный экспорт
export const Icons = {
  ArrowRight,
  ArrowUp,
  Award,
  BadgePercent,
  Beaker,
  Bug,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Cpu,
  DollarSign,
  ExternalLink,
  Eye,
  Filter,
  FlaskConical,
  Gauge,
  Gift,
  Globe,
  HardDrive,
  Headphones,
  Heart,
  HeartPulse,
  Info,
  LifeBuoy,
  Lightbulb,
  Loader: Loader2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Moon,
  Move,
  Package,
  Phone,
  PieChart,
  Plus,
  Play,
  Quote,
  Scale,
  Search,
  Send,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Smartphone,
  Star,
  Sun,
  Tag,
  Telegram,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  WhatsApp,
  X,
  Zap,
};

export type IconName = keyof typeof Icons;
