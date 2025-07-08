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
import toast from 'react-hot-toast';

export default function Header() {
  const pathname = usePathname();
  const { isAdmin, identity, setIdentity } = useBackend();
  const { disconnect } = useConnect();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = useMemo(
    () => identity?.getPrincipal.toString() !== undefined,
    [identity],
  );
  const principal = useMemo(() => {
    if (!identity) return null;
    return identity.getPrincipal();
  }, [identity]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/register', label: 'Register' },
    { href: '/explore', label: 'Explore' },
    {
      href: 'https://docs.strike.oranj.co/',
      label: 'Documentation',
      external: true,
    },
  ];

  const adminLinks = [
    { href: '/manage', label: 'Manage Registries' },
    { href: '/admin', label: 'Manage Admins' },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    setIdentity(null);
    disconnect();
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Principal copied to clipboard!');
  };

  if (pathname === '/') return <></>;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm`}
      >
        <div className=" container max-w-[1440px] mx-auto flex items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center text-black">
            <StrikeLogo width={24} height={24} />
            <span className="text-xl font-syne font-bold text-primary uppercase">
              Strike
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground`}
                >
                  {link.label}
                </a>
              ) : (
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
              ),
            )}

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
                    <span
                      className="truncate cursor-pointer"
                      title="Copy Principal"
                      onClick={() => {
                        if (principal) {
                          handleCopyText(principal.toString());
                        }
                      }}
                    >
                      {principal?.toString()}
                    </span>
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
                  borderRadius: 12,
                  padding: `8px 12px`,
                  borderColor: '#2B5ACC',
                  backgroundColor: '#3670FF',
                  fontWeight: 600,
                  fontSize: 14,
                  borderWidth: 1,
                  borderStyle: 'solid',
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
                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
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
                  ),
                )}

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
                      <div
                        className="px-3 py-2 flex items-center gap-3"
                        onClick={() => {
                          if (principal) {
                            handleCopyText(principal.toString());
                          }
                        }}
                      >
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
                        borderRadius: 12,
                        padding: `8px 12px`,
                        borderColor: '#2B5ACC',
                        backgroundColor: '#3670FF',
                        fontWeight: 600,
                        fontSize: 14,
                        borderWidth: 1,
                        borderStyle: 'solid',
                      }}
                    />
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <div className="h-20"> </div>
    </>
  );
}
