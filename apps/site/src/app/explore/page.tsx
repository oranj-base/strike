'use client';

import { useBackend } from '@/app/context';
import { Principal } from '@dfinity/principal';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function Page() {
  const [canisterId, setCanisterId] = useState('');
  const [searchedCanisterId, setSearchedCanisterId] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { actor } = useBackend();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canisterId.trim()) return;

    try {
      Principal.fromText(canisterId);
    } catch {
      toast.custom(
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid canister ID format</AlertDescription>
        </Alert>,
        { position: 'bottom-center' },
      );
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setSearchedCanisterId(canisterId);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const result = await actor.get_strike_by_canister_id({
        canisterId: canisterId,
      });

      if (result.success) setStatus(result.data?.status);
      if (!result.success) setStatus(undefined);
    } catch (error) {
      console.error('Error searching for canister:', error);
      setStatus(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12 mx-auto max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Strike Status Checker
        </h1>
        <p className="text-muted-foreground max-w-md">
          Check the status of your registered canister
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Search Canister</CardTitle>
          <CardDescription>
            Enter a canister ID to check its registration status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  value={canisterId}
                  onChange={(e) => setCanisterId(e.target.value)}
                  placeholder="Enter canister ID"
                  className="pr-10"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className="shrink-0 flex items-center text-white"
                disabled={loading || !canisterId.trim()}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center items-center p-6 mt-6">
              <Loader2 className="animate-spin h-8 w-8 text-primary mr-2" />
              <span className="text-muted-foreground">
                Searching for canister...
              </span>
            </div>
          ) : hasSearched ? (
            <div className="mt-6">
              {status ? (
                <Card className="border border-muted bg-card/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">
                      Canister Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] items-center text-sm">
                      <span className="font-medium text-muted-foreground">
                        ID:
                      </span>
                      <span className="font-mono text-xs sm:text-sm break-all">
                        {searchedCanisterId}
                      </span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center text-sm">
                      <span className="font-medium text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant={
                          status === 'Active' ? 'default' : 'destructive'
                        }
                        className="w-fit"
                      >
                        {status === 'Active' ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <AlertCircle className="mr-1 h-3 w-3" />
                        )}
                        {status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert variant="default" className="bg-muted/50">
                  <AlertTitle className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    No Results
                  </AlertTitle>
                  <AlertDescription>
                    No registry found for canister ID:
                    <span className="font-mono text-xs ml-1 break-all">
                      {searchedCanisterId}
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
