'use client';

import { useBackend } from '@/app/context';
import CanisterRegistryForm from './CanisterRegistryForm';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export function CanisterRegistry() {
  const { actor, identity } = useBackend();

  const handleSubmit = async (formData: any) => {
    if (!identity) {
      toast.error('Please connect wallet first.');
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

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Actions Registry
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Register your Action to unfurl your Strike Card on X.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm md:text-base">Check the action status</p>
        <Link
          href="/explore"
          className="text-sm md:text-base text-primary font-medium hover:underline inline-flex items-center gap-1"
        >
          here <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

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
            ensure accurate mapping between strike/action.
          </p>
        </CardContent>
      </Card>

      <div className="pt-2">
        <CanisterRegistryForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
