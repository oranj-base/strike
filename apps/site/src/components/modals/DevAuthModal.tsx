'use client';

import { useBackend } from '@/app/context';
import { testAccounts } from '@/config';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Check, User } from 'lucide-react';
import { SignIdentity } from '@dfinity/agent';

export default function DevAuthModal() {
  const [open, setOpen] = useState(false);
  const { setIdentity } = useBackend();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'm' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelectAccount = (account: SignIdentity) => {
    setIdentity(account);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-0 shadow-lg">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            Developer Authentication
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <h4 className="text-md font-medium mb-3 text-center">
            Choose a test account
          </h4>
          <Command className="rounded-lg border shadow-md overflow-hidden">
            <CommandGroup>
              {testAccounts.map((account) => (
                <CommandItem
                  key={account.name}
                  onSelect={() => handleSelectAccount(account.identity)}
                  className="flex justify-between items-center cursor-pointer py-3 px-4 data-[selected]:bg-primary/5 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary/30 p-1.5 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{account.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Development Account
                      </span>
                    </div>
                  </div>
                  <div className="h-6 w-6 rounded-full border border-primary/30 flex items-center justify-center group-data-[selected]:bg-primary group-data-[selected]:border-primary">
                    <Check className="h-3 w-3 text-primary group-data-[selected]:text-white" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </div>

        <div className="mt-4 text-xs text-center bg-muted/30 p-3 rounded-lg border flex items-center justify-center gap-1 text-muted-foreground">
          <span>Keyboard shortcut:</span>
          <kbd className="px-2 py-1 rounded bg-background border shadow-sm text-xs font-mono">
            Ctrl/⌘
          </kbd>
          <span>+</span>
          <kbd className="px-2 py-1 rounded bg-background border shadow-sm text-xs font-mono">
            M
          </kbd>
        </div>
      </DialogContent>
    </Dialog>
  );
}
