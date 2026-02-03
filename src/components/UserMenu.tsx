import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Database, ExternalLink } from 'lucide-react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { isInitialized, isLoading } = useGoogleSheets();

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const openSheet = () => {
    if (user.sheetId) {
      window.open(`https://docs.google.com/spreadsheets/d/${user.sheetId}`, '_blank');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <Database className="h-4 w-4" />
          <span>
            {isLoading ? 'Syncing...' : isInitialized ? 'Sheet connected' : 'Setting up...'}
          </span>
          {isInitialized && (
            <span className="ml-auto text-xs text-success">●</span>
          )}
        </DropdownMenuItem>
        {user.sheetId && (
          <DropdownMenuItem onClick={openSheet} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            <span>View data sheet</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive">
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
