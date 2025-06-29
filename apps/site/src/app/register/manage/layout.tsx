'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBackend } from '@/app/context';
import toast from 'react-hot-toast';

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { actor, identity } = useBackend();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(true);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

  useEffect(() => {
    const checkIsAdmin = async () => {
      setIsCheckingAdmin(true);
      try {
        if (!identity) {
          setIsAdmin(false);
          router.push('/register');
          toast.error('Please connect your wallet first');
          return;
        }

        const adminStatus = await actor.is_admin(identity.getPrincipal());
        console.log('Admin status:', adminStatus);

        if (!adminStatus) {
          router.push('/register');
          toast.error('You need admin access to view this page');
        }

        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        router.push('/register');
        toast.error('Error checking permissions');
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkIsAdmin();
  }, [identity]);

  if (isCheckingAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-gray-700">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return null; // Will redirect, no need to render anything
  }

  return <section>{children}</section>;
}
