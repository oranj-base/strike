//Client-side modal

'use client';

import { useBackend } from '@/app/context';
import { testAccounts } from '@/config';
import { useEffect, useState } from 'react';

export default function DevAuthModal() {
  const [open, setOpen] = useState(false);
  const { setIdentity } = useBackend();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="p-10 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <h3 className="text-2xl font-bold text-gray-900">Dev Auth</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none text-2xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Test Accounts</h4>
              <ul className="space-y-2">
                {testAccounts.map((account) => (
                  <li
                    key={account.name}
                    className="p-2 border rounded flex items-center justify-between hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setIdentity(account.identity);
                      setOpen(false);
                    }}
                  >
                    <span>{account.name}</span>
                    {/* Add any action button if needed */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
