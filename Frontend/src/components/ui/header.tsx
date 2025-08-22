import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { MainNavigation, MobileNavigation } from './navigation';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { Menu, FileText } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ChatDoc
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <MainNavigation />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <MobileNavigation />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}