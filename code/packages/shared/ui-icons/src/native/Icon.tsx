import type { ComponentProps } from "react";
import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Heart,
  Info,
  Lock,
  type LucideIcon,
  Mail,
  Menu,
  Moon,
  Phone,
  Rocket,
  Search,
  Settings2,
  Shield,
  Sparkles,
  Star,
  Sun,
  Users,
  X,
  Zap,
} from "lucide-react-native";
import type { GlyphName } from "../shared/glyphs";

/** name → lucide-react-native component. Mirrors the web map so both platforms share the glyph set. */
const GLYPH_COMPONENTS: Record<GlyphName, LucideIcon> = {
  zap: Zap,
  settings: Settings2,
  sparkles: Sparkles,
  shield: Shield,
  globe: Globe,
  users: Users,
  check: Check,
  star: Star,
  heart: Heart,
  search: Search,
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  clock: Clock,
  lock: Lock,
  download: Download,
  "external-link": ExternalLink,
  "arrow-right": ArrowRight,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  menu: Menu,
  x: X,
  sun: Sun,
  moon: Moon,
  bell: Bell,
  info: Info,
  "file-text": FileText,
  rocket: Rocket,
};

export type IconProps = ComponentProps<LucideIcon> & {
  name: GlyphName;
  fallback?: GlyphName;
};

/** Render a curated glyph by name (React Native). Same contract as the web `Icon`. */
export function Icon({ name, fallback = "sparkles", ...props }: IconProps) {
  const Glyph = GLYPH_COMPONENTS[name] ?? GLYPH_COMPONENTS[fallback];
  return <Glyph {...props} />;
}

export { GLYPH_COMPONENTS };
