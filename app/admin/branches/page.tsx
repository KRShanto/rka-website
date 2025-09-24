"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Search,
  Edit,
  Trash2,
  Plus,
  Building,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminListBranches,
  adminCreateBranch,
  adminUpdateBranch,
  adminDeleteBranch,
  type AdminBranch,
} from "@/actions/admin-branches";

type Branch = AdminBranch;

export default function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Initial state for new branch
  const initialNewBranch = {
    name: "",
  };

  const [newBranch, setNewBranch] = useState(initialNewBranch);

  // Fetch branches from server (Prisma actions)
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await adminListBranches();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useMemo(() => {
    fetchBranches();
  }, []);

  // Filter branches based on search
  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create branch
  const handleCreateBranch = async () => {
    try {
      setCreateLoading(true);
      const res = await adminCreateBranch(newBranch.name);
      if (!res.success) {
        toast.error(res.error || "Please enter a branch name");
      } else {
        setBranches([res.branch, ...branches]);
        setCreateDialogOpen(false);
        setNewBranch(initialNewBranch);
        toast.success("Branch created successfully");
      }
    } catch (error: any) {
      console.error("Error creating branch:", error);
      toast.error(error.message || "Failed to create branch");
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle edit branch
  const handleEditBranch = async () => {
    if (!selectedBranch) return;

    try {
      setEditLoading(true);
      const res = await adminUpdateBranch(
        selectedBranch.id,
        selectedBranch.name
      );
      if (!res.success) {
        toast.error(res.error || "Failed to update branch");
        return;
      }

      // Update local state
      setBranches(
        branches.map((b) => (b.id === selectedBranch.id ? selectedBranch : b))
      );
      setEditDialogOpen(false);
      setSelectedBranch(null);

      toast.success("Branch updated successfully");
    } catch (error) {
      console.error("Error updating branch:", error);
      toast.error("Failed to update branch");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete branch
  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;

    try {
      setDeleteLoading(true);

      // Check if branch has users
      if (selectedBranch.user_count && selectedBranch.user_count > 0) {
        toast.error(
          `Cannot delete branch with ${selectedBranch.user_count} assigned users`
        );
        return;
      }

      await adminDeleteBranch(selectedBranch.id);

      // Remove from local state
      setBranches(branches.filter((b) => b.id !== selectedBranch.id));
      setDeleteDialogOpen(false);
      setSelectedBranch(null);

      toast.success("Branch deleted successfully");
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast.error("Failed to delete branch");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Branch Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage dojo branches and locations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredBranches.length} branches
          </Badge>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search Branches</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Branches Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>All Branches</span>
          </CardTitle>
          <CardDescription>View and manage all dojo branches</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>Users Assigned</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium">{branch.name}</div>
                            <div className="text-sm text-gray-500">
                              ID: {branch.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{branch.user_count || 0} users</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(branch.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBranch(branch);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBranch(branch);
                              setDeleteDialogOpen(true);
                            }}
                            disabled={
                              !!(branch.user_count && branch.user_count > 0)
                            }
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            title={
                              branch.user_count && branch.user_count > 0
                                ? `Cannot delete: ${branch.user_count} users assigned`
                                : "Delete branch"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredBranches.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No branches found matching your criteria.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Branch Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Branch</DialogTitle>
            <DialogDescription>
              Create a new dojo branch location
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-2 py-2">
            <div>
              <Label htmlFor="create-name">
                Branch Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-name"
                value={newBranch.name}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, name: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setNewBranch(initialNewBranch);
              }}
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateBranch} disabled={createLoading}>
              {createLoading ? "Creating..." : "Add Branch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Branch Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>Update branch information</DialogDescription>
          </DialogHeader>

          {selectedBranch && (
            <div className="space-y-4 px-2 py-2">
              <div>
                <Label htmlFor="edit-name">
                  Branch Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={selectedBranch.name}
                  onChange={(e) =>
                    setSelectedBranch({
                      ...selectedBranch,
                      name: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleEditBranch} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedBranch?.name}"? This
              action cannot be undone.
              {selectedBranch?.user_count && selectedBranch.user_count > 0 && (
                <div className="mt-2 text-red-600 font-medium">
                  Warning: This branch has {selectedBranch.user_count} assigned
                  users. Please reassign users before deleting.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBranch}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Deleting..." : "Delete Branch"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
