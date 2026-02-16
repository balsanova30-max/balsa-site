
import React from 'react';
import { Zap, Battery, Cpu, Lightbulb, Activity, ChevronRight, MessageSquare, Send, BookOpen, Clock, ShieldCheck, Award, Lock } from 'lucide-react';

const icons = {
  Zap,
  Battery,
  Cpu,
  Lightbulb,
  Activity,
  ChevronRight,
  MessageSquare,
  Send,
  BookOpen,
  Clock,
  ShieldCheck,
  Award,
  Lock
};

interface IconWrapperProps {
  name: keyof typeof icons;
  className?: string;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ name, className }) => {
  const IconComponent = icons[name];
  return <IconComponent className={className} />;
};
