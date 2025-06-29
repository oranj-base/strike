'use client';

import { useBackend } from '@/app/context';
import { Principal } from '@dfinity/principal';
import { useState } from 'react';
import toast from 'react-hot-toast';

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
      toast.error('Invalid canister ID format', { position: 'bottom-center' });
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-8">Strike Status Checker</h1>

      <form onSubmit={handleSearch} className="w-full max-w-md">
        <div className="flex gap-2">
          <input
            type="text"
            value={canisterId}
            onChange={(e) => setCanisterId(e.target.value)}
            placeholder="Enter canister ID"
            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !canisterId.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="mt-8 w-full max-w-md">
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Searching for canister...</span>
          </div>
        ) : hasSearched ? (
          status ? (
            <div className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
              <h2 className="font-medium text-lg">Canister Details</h2>
              <div className="mt-2">
                <p>
                  <span className="font-medium">ID:</span> {searchedCanisterId}
                </p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-1 ${
                      status === 'Active' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {status}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 border border-gray-200 rounded-md bg-gray-50">
              <p>No results found for canister ID: {searchedCanisterId}</p>
            </div>
          )
        ) : undefined}
      </div>
    </div>
  );
}
