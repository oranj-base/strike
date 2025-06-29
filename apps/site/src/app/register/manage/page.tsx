'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useBackend } from '@/app/context';
import { Registry } from '@/backend/types';
import { Principal } from '@dfinity/principal';

type StatusType = 'Submitted' | 'Blocked' | 'Trusted' | 'All';

export default function ManageRegistryPage() {
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>('All');
  const [selectedRegistry, setSelectedRegistry] = useState<Registry | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRegistries, setIsFetchingRegistries] = useState(false);
  const { actor } = useBackend();

  const fetchRegistriesByStatus = async (status: StatusType) => {
    setIsFetchingRegistries(true);
    try {
      const data = await actor.get_registry_by_status({ status });
      if (data) setRegistries(data);
      else setRegistries([]);
    } catch (error) {
      console.error('Error fetching registries:', error);
      setRegistries([]);
    } finally {
      setIsFetchingRegistries(false);
    }
  };

  useEffect(() => {
    fetchRegistriesByStatus(selectedStatus);
  }, [selectedStatus]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // @ts-ignore
    setSelectedStatus(e.target.value);
  };

  const handleRowClick = useCallback((registry: Registry) => {
    setSelectedRegistry(registry);
    setIsModalOpen(true);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRegistry(null);
  };

  const handleApprove = useCallback(async () => {
    if (!selectedRegistry) return;

    setIsLoading(true);
    try {
      await actor.update_registry_status(selectedRegistry.canisterId, {
        Trusted: null,
      });
      await fetchRegistriesByStatus(selectedStatus);
      closeModal();
    } catch (error) {
      console.error('Error approving registry:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRegistry, selectedStatus, actor]);

  const handleBlock = useCallback(async () => {
    if (!selectedRegistry) return;

    setIsLoading(true);
    try {
      await actor.update_registry_status(selectedRegistry.canisterId, {
        Blocked: null,
      });
      await fetchRegistriesByStatus(selectedStatus);
      closeModal();
    } catch (error) {
      console.error('Error blocking registry:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRegistry, selectedStatus, actor]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Registries</h1>

      <div className="mb-6">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Filter by Status
        </label>
        <select
          id="status"
          value={selectedStatus}
          onChange={handleStatusChange}
          className="mt-1 block w-64 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="All">All </option>
          <option value="Submitted">Submitted</option>
          <option value="Trusted">Trusted</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow relative">
        {isFetchingRegistries && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <p className="mt-2 text-gray-700">Loading registries...</p>
            </div>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Canister ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(!registries || registries?.length === 0) && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No registries found with this status
                </td>
              </tr>
            )}
            {registries?.map((registry, index) => {
              return (
                <tr
                  key={'registry' + index}
                  onClick={() => handleRowClick(registry)}
                  className={`cursor-pointer hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registry.canisterId.toString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registry.projectName}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      registry.status === 'Trusted'
                        ? 'text-green-600'
                        : registry.status === 'Blocked'
                          ? 'text-red-600'
                          : registry.status === 'Submitted'
                            ? 'text-yellow-600'
                            : ''
                    }`}
                  >
                    {registry.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedRegistry && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="bg-white p-6 rounded-lg shadow-xl z-10 max-w-2xl w-full mx-4 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedRegistry.projectName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Canister ID</p>
                <p className="font-medium">
                  {selectedRegistry.canisterId.toString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Project Name</p>
                <p className="font-medium">{selectedRegistry.projectName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedRegistry.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedRegistry.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Telegram</p>
                <p className="font-medium">{selectedRegistry.telegram}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Twitter</p>
                <p className="font-medium">{selectedRegistry.twitter}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p
                  className={`font-medium ${
                    selectedRegistry.status === 'Trusted'
                      ? 'text-green-600'
                      : selectedRegistry.status === 'Blocked'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                  }`}
                >
                  {selectedRegistry.status || 'Pending'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {selectedRegistry.createdAt.toLocaleString()}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-500">Added By</p>
                <p className="font-medium break-all">
                  {selectedRegistry.addedBy.toString()}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-500">Strike Card Link</p>
                <a
                  href={selectedRegistry.strikeCardLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {selectedRegistry.strikeCardLink}
                </a>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedRegistry.description}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={handleBlock}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Processing...' : 'Block'}
              </button>
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
