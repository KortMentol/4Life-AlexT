/**
 * @module src/utils/icons.ts
 * @description Централизованный модуль для управления иконками из библиотеки `lucide-react`.
 * Экспортирует объект `Icons`, который содержит все используемые в проекте иконки, а также тип `IconName` для строгой типизации имен иконок.
 * @author Kort
 * @version 1.0.0
 * @see https://lucide.dev/guide/packages/lucide-react
 * @usage
 * 1. `src/pages/HowToBuyPage.tsx`: Используется для отображения иконок в информационных блоках.
 * @example
 * import { Icons, IconName } from '@/utils/icons';
 *
 * interface IconProps {
 *   name: IconName;
 * }
 *
 * const Icon = ({ name }: IconProps) => {
 *   const LucideIcon = Icons[name];
 *   return <LucideIcon />;
 * }
 */

// Импортируем только используемые иконки
import {
  ArrowRight,
  Award,
  BadgePercent,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  FlaskConical,
  Gift,
  Globe,
  Headphones,
  HeartPulse,
  LifeBuoy,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Moon,
  Phone,
  PieChart,
  Quote,
  Scale,
  Send,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Sun,
  Tag,
  TrendingUp,
  Truck,
  User,
  UserPlus,
  Users,
  // Whatsapp (будем использовать Phone)
  X,
  Zap,
} from "lucide-react";

export const Icons = {
  Check,
  ExternalLink,
  HeartPulse,
  ShieldCheck,
  Scale,
  Sparkles,
  Star,
  PieChart,
  Clock,
  Globe,
  Headphones,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Phone,
  Quote,
  Send,
  Shield,
  ShoppingCart,
  Tag,
  TrendingUp,
  Users,
  UserPlus,
  User,
  Whatsapp: Phone, // Используем Phone как замену Whatsapp, который не доступен в lucide-react
  X,
  Zap,
  ArrowRight,
  Award,
  CheckCircle,
  DollarSign,
  FlaskConical,
  Gift,
  LifeBuoy,
  Sun,
  Moon,
  Truck,
  BadgePercent,
};

export type IconName = keyof typeof Icons;
