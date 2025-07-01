'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBackend } from '@/app/context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Menu, ChevronDown, User, LogOut } from 'lucide-react';
import { ConnectButton, useConnect } from '@oranjbase/icp-wallet-adapter-react';
import { StrikeLogo } from '@/assets';

export default function Header() {
  const pathname = usePathname();
  const { actor, identity } = useBackend();
  const { isConnected, disconnect } = useConnect();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = useMemo(() => isConnected, [isConnected]);
  const principal = useMemo(() => {
    if (!identity) return null;
    return identity.getPrincipal();
  }, [identity]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/register', label: 'Register' },
    { href: '/explore', label: 'Explore' },
    { href: '/docs', label: 'Documentation' },
  ];

  const adminLinks = [{ href: '/manage', label: 'Manage Registries' }];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const load = async () => {
      if (!identity) return;
      const res = await actor.is_admin(identity.getPrincipal());
      setIsAdmin(res);
    };
    load();
  }, [identity]);

  const getUserInitials = () => {
    if (!principal) return 'U';
    const principalText = principal.toString();
    return principalText.substring(0, 2).toUpperCase();
  };

  const getTruncatedPrincipal = () => {
    if (!principal) return '';
    const principalText = principal.toString();
    return `${principalText.substring(0, 5)}...${principalText.substring(principalText.length - 3)}`;
  };

  const logout = () => {
    disconnect();
  };

  if (pathname === '/') return <></>;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm`}
      >
        <div className=" gap-[64px] container mx-auto px-5d py-3  items-center justify-between flex sm:flex-row flex-col md:gap-[20px] sm:justify-between lg:px-[160px] px-[20px]">
          <Link href="/" className="flex items-center text-black">
            <StrikeLogo width={24} height={24} />
            <span className="text-xl font-syne font-bold text-primary uppercase">
              Strike
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted ${
                  pathname === link.href
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Dropdown - Only show if user has admin links */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 px-3 py-2"
                  >
                    Admin
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {adminLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* User Authentication Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-1"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-sm">
                      {getTruncatedPrincipal()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="font-mono text-xs opacity-70">
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">{principal?.toString()}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ConnectButton
                style={{
                  height: '40px',
                  background: '#2563eb',
                  textAlign: 'center',
                }}
              />
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-muted ${
                      pathname === link.href
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Admin Links in Mobile Menu */}
                {isAdmin && (
                  <>
                    <div className="border-t my-2" />
                    <p className="px-3 text-sm font-semibold text-muted-foreground">
                      Admin
                    </p>
                    {adminLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}

                {/* Mobile Authentication */}
                <div className="border-t mt-2 pt-4">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-white">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="font-medium text-sm">Connected</p>
                          <p className="font-mono text-xs text-muted-foreground truncate">
                            {principal?.toString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full justify-start mt-2"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </Button>
                    </>
                  ) : (
                    <ConnectButton
                      style={{
                        height: '40px',
                        background: '#2563eb',
                        textAlign: 'center',
                      }}
                    />
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <div className="h-10"> </div>
    </>
  );
}
