import { useEffect, useState } from 'react';

import { Action, type ActionAdapter } from '../api/index.ts';
import { unfurlUrlToActionApiUrl } from '../utils/url-mapper.ts';

interface UseActionOptions {
  url: string | URL;
  adapter?: ActionAdapter;
  securityRegistryRefreshInterval?: number;
  skip?: boolean;
}

function useActionApiUrl(url: string | URL) {
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    unfurlUrlToActionApiUrl(new URL(url))
      .then((apiUrl) => {
        if (ignore) {
          return;
        }
        setApiUrl(apiUrl);
      })
      .catch((e) => {
        console.error('[@dialectlabs/blinks] Failed to unfurl action URL', e);
        setApiUrl(null);
      });

    return () => {
      ignore = true;
    };
  }, [url]);

  return { actionApiUrl: apiUrl };
}

export function useAction({ url, adapter, skip = false }: UseActionOptions) {
  const { actionApiUrl } = useActionApiUrl(url);
  const [action, setAction] = useState<Action | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (skip) return;
    setIsLoading(true);
    if (!actionApiUrl) {
      return;
    }

    let ignore = false;
    Action.fetch(actionApiUrl, adapter)
      .then((action) => {
        if (ignore) {
          return;
        }
        setAction(action);
      })
      .catch((e) => {
        console.error('[@dialectlabs/blinks] Failed to fetch action', e);
        setAction(null);
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionApiUrl]);

  useEffect(() => {
    if (adapter) action?.setAdapter(adapter);
  }, [action, adapter]);

  return { action, isLoading };
}
