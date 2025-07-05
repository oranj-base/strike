'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Principal } from '@dfinity/principal';
import {
  Loader2,
  Plus,
  Trash2,
  UserCog,
  Copy,
  CheckCircle,
} from 'lucide-react';

import { useBackend } from '@/app/context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const { actor, identity } = useBackend();

  const [admins, setAdmins] = useState<Principal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAdmins, setIsFetchingAdmins] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Principal | null>(null);
  const [newAdminInput, setNewAdminInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setIsFetchingAdmins(true);
    try {
      const adminList = await actor.get_admins();
      setAdmins(adminList);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setIsFetchingAdmins(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async () => {
    if (!newAdminInput.trim()) {
      setInputError('Principal ID cannot be empty');
      return;
    }

    let principalToAdd: Principal;

    try {
      principalToAdd = Principal.fromText(newAdminInput.trim());
    } catch (error) {
      setInputError('Invalid Principal ID format');
      return;
    }

    const isAlreadyAdmin = admins.some(
      (admin) => admin.toString() === principalToAdd.toString(),
    );

    if (isAlreadyAdmin) {
      setInputError('This Principal is already an administrator');
      return;
    }

    setIsLoading(true);
    setInputError('');

    try {
      await actor.add_admin(principalToAdd);
      await fetchAdmins();
      setAddDialogOpen(false);
      setNewAdminInput('');
      toast.success('Administrator added successfully');
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.success('Failed to add administrator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!selectedAdmin) return;

    setIsLoading(true);
    try {
      await actor.remove_admin(selectedAdmin);
      await fetchAdmins();
      setRemoveDialogOpen(false);
      setSelectedAdmin(null);

      toast.success('Administrator removed successfully');
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.success('Failed to remove administrator');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const isSelf = (admin: Principal) => {
    return identity?.getPrincipal().toString() === admin.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-[calc(100vh-200px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Administrator Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage administrators who can approve and block registry entries
          </p>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="w-full md:w-auto text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Administrator
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Administrators
          </CardTitle>
          <CardDescription>
            Administrators can manage registry entries and other administrators
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 relative">
          {isFetchingAdmins && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 flex items-center justify-center z-10 rounded-md">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading administrators...
                </p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Principal ID</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!admins || admins.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No administrators found
                    </TableCell>
                  </TableRow>
                )}
                {admins.map((admin, index) => (
                  <TableRow key={`admin-${index}`}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center">
                        <span className="truncate max-w-[250px] md:max-w-[400px]">
                          {admin.toString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 h-8 w-8"
                          onClick={() => copyToClipboard(admin.toString())}
                        >
                          {copied === admin.toString() ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="sr-only">Copy principal ID</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isSelf(admin) ? (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary"
                        >
                          You
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setRemoveDialogOpen(true);
                        }}
                        disabled={isSelf(admin)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove admin</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Administrator</DialogTitle>
            <DialogDescription>
              Enter the Principal ID of the new administrator
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="principalId" className="mb-2 block">
              Principal ID
            </Label>
            <Input
              id="principalId"
              value={newAdminInput}
              onChange={(e) => {
                setNewAdminInput(e.target.value);
                setInputError('');
              }}
              placeholder="aaaaa-aa"
              className={inputError ? 'border-red-500' : ''}
            />
            {inputError && (
              <p className="text-sm text-red-500 mt-1">{inputError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddDialogOpen(false);
                setNewAdminInput('');
                setInputError('');
              }}
            >
              Cancel
            </Button>
            <Button
              className="text-white"
              onClick={handleAddAdmin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                </>
              ) : (
                'Add Administrator'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this administrator? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedAdmin && (
            <div className="my-2 p-3 bg-muted rounded-md font-mono text-sm break-all">
              {selectedAdmin.toString()}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setRemoveDialogOpen(false);
                setSelectedAdmin(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAdmin}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removing...
                </>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
