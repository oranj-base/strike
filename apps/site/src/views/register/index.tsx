'use client';

import { useBackend } from '@/app/context';
import CanisterRegistryForm from './CanisterRegistryForm';
import { useConnect, useDialog } from '@oranjbase/icp-wallet-adapter-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, AlertCircle } from 'lucide-react';

const isLocal = process.env.NEXT_PUBLIC_DFX_NETWORK === 'local';

export function CanisterRegistry() {
  const { actor, identity } = useBackend();
  const [isAdmin, setIsAdmin] = useState(false);
  const { isConnected } = useConnect();
  const { open } = useDialog();

  const handleSubmit = async (formData: any) => {
    console.log('Form submitted:', formData);
    if (!isConnected && !isLocal) {
      open();
      return;
    }
    if (isLocal && !identity) {
      toast.custom(
        <Alert
          variant="destructive"
          className="border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please connect wallet first.</AlertDescription>
        </Alert>,
        {
          position: 'bottom-center',
        },
      );
      return;
    }

    const res = await actor.add_registry({ ...formData });
    if (res.success) {
      toast.success(
        "Your request's in! Hang tight while we review it. It might take a couple days.",
      );
    } else {
      toast.error(
        'Oops, something went wrong. Please try again in a bit or reach out to support.',
      );
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!identity) return;
      const res = await actor.is_admin(identity.getPrincipal());
      setIsAdmin(res);
    };
    load();
  }, [identity]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Actions Registry
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Register your Action to unfurl your Blink on Twitter.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm md:text-base">Check the action status</p>
        <Link
          href="/register/status"
          className="text-sm md:text-base text-primary font-medium hover:underline inline-flex items-center gap-1"
        >
          here <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isAdmin && (
        <Button
          asChild
          variant="default"
          className="transition-all hover:shadow-md text-white"
        >
          <Link href="/register/manage">Manage Registry (Admin)</Link>
        </Button>
      )}

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>General Guidelines</CardTitle>
          <CardDescription>
            What you need to know before submitting your action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm md:text-base text-muted-foreground">
            Due to a high volume of inbound submissions, it may take a few days
            for approval. Thank you for your patience.
          </p>
          <div className="border-t border-border my-2" />
          <p className="text-sm md:text-base text-muted-foreground">
            Please make sure you provide a sample URL you would want to tweet to
            ensure accurate mapping between blink/action.
          </p>
        </CardContent>
      </Card>

      <div className="pt-2">
        <CanisterRegistryForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
