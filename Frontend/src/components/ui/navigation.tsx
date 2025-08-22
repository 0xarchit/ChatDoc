import { Link, useLocation } from 'react-router-dom';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { FileText, Home, Info, Shield, Mail, BookOpen } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: FileText },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Privacy', href: '/privacy', icon: Shield },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export function MainNavigation() {
  const location = useLocation();

  return (
    <nav className="flex items-center space-x-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Button
            key={item.name}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "transition-colors",
              isActive && "bg-primary text-primary-foreground"
            )}
          >
            <Link to={item.href}>
              <Icon className="h-4 w-4 mr-2" />
              {item.name}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export function MobileNavigation() {
  const location = useLocation();

  return (
    <div className="flex flex-col space-y-1 p-4">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Button
            key={item.name}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "justify-start transition-colors",
              isActive && "bg-primary text-primary-foreground"
            )}
          >
            <Link to={item.href}>
              <Icon className="h-4 w-4 mr-2" />
              {item.name}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}