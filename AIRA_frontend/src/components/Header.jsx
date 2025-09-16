import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, ChevronDown, Feather, RefreshCw, Sparkles, MessagesSquare, Globe, ListChecks, LayoutDashboard, PenSquare, BookOpen, History, FileText, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const LOGO_URL = 'https://horizons-cdn.hostinger.com/ddb0dda0-2996-4a30-8929-470aefbbab9a/d3df106fc9bbdd4ed2982bc9768871e4.png';

const featureItems = [
  { name: 'Grammar Checker', icon: Feather, href: '/writer', color: 'text-green-500' },
  { name: 'Paraphraser', icon: RefreshCw, href: '/writer', color: 'text-blue-500' },
  { name: 'AI Writing Assistant', icon: Sparkles, href: '/writer', color: 'text-purple-500' },
  { name: 'Chat with PDFs', icon: MessagesSquare, href: '/dashboard', color: 'text-orange-500' },
  { name: 'Online Translator', icon: Globe, href: '/writer', color: 'text-teal-500' },
  { name: 'Submission Checks', icon: ListChecks, href: '/writer', color: 'text-indigo-500' },
];

const dashboardNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { name: 'Writer', href: '/writer', icon: PenSquare, color: 'text-green-500' },
    { name: 'Resources', href: '/resources', icon: BookOpen, color: 'text-orange-500' },
    { name: 'Recent Activity', href: '/history', icon: History, color: 'text-purple-500' },
];

const homeNavItems = [
    { name: 'Research Paper Finder', href: '/dashboard', icon: FileText, color: 'text-orange-500' },
    { name: 'Resources', href: '/resources', icon: BookOpen, color: 'text-green-500' },
    { name: 'FAQ', href: '/faq', icon: HelpCircle, color: 'text-purple-500' },
]

export function Header() {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3">
          <img src={LOGO_URL} alt="AIRA Logo" className="h-12 w-auto object-contain"/>
          <span className="font-bold text-xl text-foreground">AIRA</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {user ? (
            dashboardNavItems.map(item => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center transition-colors hover:text-primary",
                                isActive ? "text-primary font-semibold" : "text-muted-foreground"
                            )
                        }
                    >
                        <Icon className={cn("mr-2 h-4 w-4", item.color)} />
                        {item.name}
                    </NavLink>
                )
            })
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer hover:text-primary transition-colors text-muted-foreground">
                    <Sparkles className="mr-2 h-4 w-4 text-purple-500"/>
                    <span>Features</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  {featureItems.map((item) => (
                    <DropdownMenuItem key={item.name} onClick={() => navigate(item.href)}>
                      <item.icon className={cn("mr-2 h-4 w-4", item.color)} />
                      <span>{item.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {homeNavItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center transition-colors hover:text-primary",
                                isActive ? "text-primary font-semibold" : "text-muted-foreground"
                            )
                        }
                    >
                        <Icon className={cn("mr-2 h-4 w-4", item.color)} />
                        {item.name}
                    </NavLink>
                  )
              })}
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="p-2">
                  <p className="font-medium">{user.user_metadata?.name || user.email.split('@')[0]}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowAuthModal(true)} size="sm" className="hidden sm:inline-flex">
                Log in
              </Button>
              <Button onClick={() => setShowAuthModal(true)} size="sm">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </motion.header>
  );
}