import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Calendar, History, Crown, User, LogIn } from 'lucide-react';

const MobileNav: React.FC = () => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-foreground">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle className="gradient-text">LifeVibe</SheetTitle>
            <SheetDescription>
              Navigate to different sections of your app
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-8">
            <Link to="/calendar">
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                <Calendar className="w-4 h-4 mr-3" />
                Calendar
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                <History className="w-4 h-4 mr-3" />
                History
              </Button>
            </Link>
            <Link to="/premium">
              <Button variant="ghost" className="w-full justify-start text-primary hover:bg-primary/10 bg-primary/5 border border-primary/20">
                <Crown className="w-4 h-4 mr-3" />
                Premium - ₹149/month
              </Button>
            </Link>
            <div className="border-t border-muted my-4" />
            <Link to="/signin">
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-muted">
                <User className="w-4 h-4 mr-3" />
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button className="w-full bg-gradient-primary hover:shadow-glow">
                <LogIn className="w-4 h-4 mr-3" />
                Get Started
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;