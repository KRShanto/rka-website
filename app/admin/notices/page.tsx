"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Bell,
  Search,
  Edit,
  Trash2,
  Plus,
  Filter,
  Calendar,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { listBranches } from "@/actions/branches";
import {
  adminListNotices,
  adminCreateNotice,
  adminUpdateNotice,
  adminDeleteNotice,
} from "@/actions/admin-notices";

interface Notice {
  id: string;
  title: string;
  description: string;
  date: string; // ISO
  branchId: string; // may be empty string for global
  created_at: string; // ISO
}

interface Branch {
  id: string;
  name: string;
}

export default function NoticeManagement() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Initial state for new notice
  const initialNewNotice = {
    title: "",
    description: "",
    date: "",
    branch: null as string | null,
  };

  const [newNotice, setNewNotice] = useState(initialNewNotice);

  // Fetch branches via Prisma
  const fetchBranches = async () => {
    try {
      const data = await listBranches();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to load branches");
    }
  };

  // Fetch notices via Prisma
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await adminListNotices();
      setNotices(data as any);
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchBranches();
  }, []);

  // Filter notices based on search and branch filter
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch =
      branchFilter === "all" ||
      (branchFilter === "none" && !notice.branchId) ||
      notice.branchId === branchFilter;
    return matchesSearch && matchesBranch;
  });

  // Handle create notice
  const handleCreateNotice = async () => {
    try {
      setCreateLoading(true);

      // Validate required fields
      if (!newNotice.title.trim()) {
        toast.error("Please enter a notice title");
        return;
      }

      if (!newNotice.description.trim()) {
        toast.error("Please enter a notice description");
        return;
      }

      const res = await adminCreateNotice({
        title: newNotice.title.trim(),
        description: newNotice.description.trim(),
        date: newNotice.date || null,
        branchId: newNotice.branch ? newNotice.branch : "",
      });
      if (!res.success) throw new Error(res.error || "Failed to create notice");
      setNotices([res.notice as any, ...notices]);
      setCreateDialogOpen(false);
      setNewNotice(initialNewNotice);

      toast.success("Notice created successfully");
    } catch (error: any) {
      console.error("Error creating notice:", error);
      toast.error(error.message || "Failed to create notice");
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle edit notice
  const handleEditNotice = async () => {
    if (!selectedNotice) return;

    try {
      setEditLoading(true);

      if (!selectedNotice.title.trim()) {
        toast.error("Please enter a notice title");
        return;
      }

      if (!selectedNotice.description.trim()) {
        toast.error("Please enter a notice description");
        return;
      }

      const res = await adminUpdateNotice(selectedNotice.id, {
        title: selectedNotice.title.trim(),
        description: selectedNotice.description.trim(),
        date: selectedNotice.date || null,
        branchId: selectedNotice.branchId,
      });
      if (!res.success) throw new Error(res.error || "Failed to update notice");

      // Update local state
      setNotices(
        notices.map((n) => (n.id === selectedNotice.id ? selectedNotice : n))
      );
      setEditDialogOpen(false);
      setSelectedNotice(null);

      toast.success("Notice updated successfully");
    } catch (error) {
      console.error("Error updating notice:", error);
      toast.error("Failed to update notice");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete notice
  const handleDeleteNotice = async () => {
    if (!selectedNotice) return;

    try {
      setDeleteLoading(true);
      await adminDeleteNotice(selectedNotice.id);

      // Remove from local state
      setNotices(notices.filter((n) => n.id !== selectedNotice.id));
      setDeleteDialogOpen(false);
      setSelectedNotice(null);

      toast.success("Notice deleted successfully");
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get branch name by ID
  const getBranchName = (branchId: string | null | undefined) => {
    if (!branchId) return "All Branches";
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString();
  };

  // Format datetime for input
  const formatDateTimeForInput = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notice Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage announcements and notices
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredNotices.length} notices
          </Badge>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Notice
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Notices</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="branch-filter">Filter by Branch</Label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger id="branch-filter">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="none">All Branches (Global)</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>All Notices</span>
          </CardTitle>
          <CardDescription>
            View and manage all notices and announcements
          </CardDescription>
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
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Notice Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell>
                        <div className="font-medium">{notice.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">
                          {notice.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {getBranchName(notice.branchId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {formatDate(notice.date)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(notice.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedNotice(notice);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedNotice(notice);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredNotices.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No notices found matching your criteria.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Notice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Notice</DialogTitle>
            <DialogDescription>
              Create a new notice or announcement
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-2 py-2">
            <div>
              <Label htmlFor="create-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-title"
                value={newNotice.title}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, title: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="create-description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="create-description"
                value={newNotice.description}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-date">Notice Date</Label>
                <Input
                  id="create-date"
                  type="datetime-local"
                  value={newNotice.date}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="create-branch">Branch</Label>
                <Select
                  value={(newNotice.branch as string | null) || "none"}
                  onValueChange={(value) =>
                    setNewNotice({
                      ...newNotice,
                      branch: value === "none" ? null : value,
                    })
                  }
                >
                  <SelectTrigger id="create-branch">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All Branches</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setNewNotice(initialNewNotice);
              }}
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateNotice} disabled={createLoading}>
              {createLoading ? "Creating..." : "Add Notice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notice Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
            <DialogDescription>Update notice information</DialogDescription>
          </DialogHeader>

          {selectedNotice && (
            <div className="space-y-4 px-2 py-2">
              <div>
                <Label htmlFor="edit-title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-title"
                  value={selectedNotice.title}
                  onChange={(e) =>
                    setSelectedNotice({
                      ...selectedNotice,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="edit-description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedNotice.description}
                  onChange={(e) =>
                    setSelectedNotice({
                      ...selectedNotice,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Notice Date</Label>
                  <Input
                    id="edit-date"
                    type="datetime-local"
                    value={formatDateTimeForInput(selectedNotice.date)}
                    onChange={(e) =>
                      setSelectedNotice({
                        ...selectedNotice,
                        date: e.target.value || "",
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-branch">Branch</Label>
                  <Select
                    value={selectedNotice.branchId || "none"}
                    onValueChange={(value) =>
                      setSelectedNotice({
                        ...selectedNotice,
                        branchId: value === "none" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger id="edit-branch">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
            <Button onClick={handleEditNotice} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedNotice?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNotice}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Deleting..." : "Delete Notice"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
