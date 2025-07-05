'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useBackend } from '@/app/context';
import { Registry } from '@/backend/types';

// Import Shadcn UI components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const fetchRegistriesByStatus = async (status: StatusType) => {
    setIsFetchingRegistries(true);
    try {
      const data = await actor.get_registries({
        status,
        pagination: { page: 1, pageSize },
      });
      if (data) {
        setRegistries(data.items);
        setTotal(data.total);
      } else setRegistries([]);
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

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as StatusType);
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
      await actor.update_registry_status({
        canisterId: selectedRegistry.canisterId,
        status: 'Trusted',
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
      await actor.update_registry_status({
        canisterId: selectedRegistry.canisterId,
        status: 'Blocked',
      });
      await fetchRegistriesByStatus(selectedStatus);
      closeModal();
    } catch (error) {
      console.error('Error blocking registry:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRegistry, selectedStatus, actor]);

  const getStatusBadge = (status: string | null) => {
    if (!status) {
      return <Badge variant="outline">Unknown</Badge>;
    }
    switch (status) {
      case 'Trusted':
        return (
          <Badge
            className="bg-green-600 text-white border-none"
            variant="default"
          >
            {status}
          </Badge>
        );
      case 'Blocked':
        return (
          <Badge
            className="bg-red-600 text-white border-none"
            variant="destructive"
          >
            {status}
          </Badge>
        );
      case 'Submitted':
        return (
          <Badge
            className="bg-yellow-400 text-black border-none"
            variant="secondary"
          >
            {status}
          </Badge>
        );
      default:
        return (
          <Badge
            className="bg-gray-400 text-white border-none"
            variant="outline"
          >
            {status}
          </Badge>
        );
    }
  };

  const fetchRegistriesPage = async (status: StatusType, page: number) => {
    setIsFetchingRegistries(true);
    try {
      const data = await actor.get_registries({
        status,
        pagination: { page, pageSize },
      });
      if (data) {
        setRegistries(data.items);
        setTotal(data.total);
      } else setRegistries([]);
    } catch (error) {
      console.error('Error fetching registries:', error);
      setRegistries([]);
    } finally {
      setIsFetchingRegistries(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-[calc(100vh-200px)]">
      <h1 className="text-3xl font-bold mb-6">Manage Registries</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <label
                htmlFor="status"
                className="text-sm font-medium mb-2 block"
              >
                Filter by Status
              </label>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Trusted">Trusted</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-0 relative">
          {isFetchingRegistries && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center z-10 rounded-md">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading registries...
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canister ID</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!registries || registries?.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No registries found with this status
                    </TableCell>
                  </TableRow>
                )}
                {registries?.map((registry, index) => (
                  <TableRow
                    key={`registry-${index}`}
                    onClick={() => handleRowClick(registry)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-sm">
                      {registry.canisterId.toString()}
                    </TableCell>
                    <TableCell>{registry.projectName}</TableCell>
                    <TableCell>{getStatusBadge(registry.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {total > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min((page - 1) * pageSize + 1, total)} to{' '}
                  {Math.min(page * pageSize, total)} of {total} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (page > 1) {
                        setPage(page - 1);
                        fetchRegistriesPage(selectedStatus, page - 1);
                      }
                    }}
                    disabled={page === 1 || isFetchingRegistries}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center">
                    {Array.from(
                      { length: Math.ceil(total / pageSize) },
                      (_, i) => i + 1,
                    )
                      .filter((p) => {
                        return (
                          p === 1 ||
                          p === Math.ceil(total / pageSize) ||
                          (p >= page - 1 && p <= page + 1)
                        );
                      })
                      .map((p, i, arr) => (
                        <React.Fragment key={p}>
                          {i > 0 && arr[i - 1] !== p - 1 && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Button
                            variant={p === page ? 'default' : 'outline'}
                            size="sm"
                            className="w-9 h-9"
                            style={{ color: p === page ? 'white' : 'black' }}
                            onClick={() => {
                              setPage(p);
                              fetchRegistriesPage(selectedStatus, p);
                            }}
                            disabled={isFetchingRegistries}
                          >
                            {p}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (page < Math.ceil(total / pageSize)) {
                        setPage(page + 1);
                        fetchRegistriesPage(selectedStatus, page + 1);
                      }
                    }}
                    disabled={
                      page >= Math.ceil(total / pageSize) ||
                      isFetchingRegistries
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registry Detail Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedRegistry?.projectName}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedRegistry && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                <div>
                  <p className="text-sm text-muted-foreground">Canister ID</p>
                  <p className="font-medium font-mono text-sm break-all">
                    {selectedRegistry.canisterId.toString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Project Name</p>
                  <p className="font-medium">{selectedRegistry.projectName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedRegistry.name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRegistry.email}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Telegram</p>
                  <p className="font-medium">{selectedRegistry.telegram}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Twitter</p>
                  <p className="font-medium">{selectedRegistry.twitter}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedRegistry.status)}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {selectedRegistry.createdAt.toLocaleString()}
                  </p>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Added By</p>
                  <p className="font-medium break-all font-mono text-sm">
                    {selectedRegistry.addedBy.toString()}
                  </p>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Strike Card Link
                  </p>
                  <a
                    href={selectedRegistry.strikeCardLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline break-all"
                  >
                    {selectedRegistry.strikeCardLink}
                  </a>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedRegistry.description}</p>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlock}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                </>
              ) : (
                'Block'
              )}
            </Button>
            <Button
              variant="default"
              onClick={handleApprove}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                </>
              ) : (
                'Approve'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
