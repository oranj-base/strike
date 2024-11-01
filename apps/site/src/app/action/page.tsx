'use server';
import type { Metadata, ResolvingMetadata } from 'next';

// DO NOT IMPORT FROM core directly
import { unfurlUrlToActionApiUrl } from '@oranjlabs/strike/utils';
import { Action } from '@oranjlabs/strike/api';

import { StrikePage } from '@/views';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const actionUrl = searchParams['url'];

  if (typeof actionUrl !== 'string') {
    throw new Error('Invalid action url');
  }

  const actionApiUrl = await unfurlUrlToActionApiUrl(actionUrl);

  const action = await Action.fetch(actionApiUrl);

  return {
    title: `STRIKE | ${action.title}`,
    description: action.description,
    openGraph: {
      images: [action.icon],
    },
  };
}

export default async function ActionPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const actionUrl = searchParams['url'];

  return <StrikePage url={actionUrl} />;
}
