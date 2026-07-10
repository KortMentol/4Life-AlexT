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
  Microscope,
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
  ShoppingBag, // Заменил уродливый ClipboardList на премиальный ShoppingBag
  ShoppingCart,
  Sliders,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  Tag,
  Trash2, // Современная корзина вместо грубого Trash
  TrendingUp,
  Truck,
  User,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import React from "react";

// --- КАСТОМНЫЕ ПРЕМИАЛЬНЫЕ ИКОНКИ (Zero Dependencies) ---
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
    <path d="m15 10-4 4 6 6 4-16-18 7 4 2 2 6 3-4" />
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
  Microscope,
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
  Sparkles,
  Star,
  Sun,
  Tag,
  Telegram,
  Trash2,
  TrendingUp,
  Truck,
  User,
  UserPlus,
  Users,
  WhatsApp,
  X,
  Zap,
};

export type IconName = keyof typeof Icons;
