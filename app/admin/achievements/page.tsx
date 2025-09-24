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
  Trophy,
  Search,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  Calendar,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  adminListAchievements,
  adminCreateAchievement,
  adminUpdateAchievement,
  adminDeleteAchievement,
} from "@/actions/admin-achievements";

interface Achievement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string | null;
}

export default function AchievementsManagement() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");

  // Initial state for new achievement
  const initialNewAchievement = {
    title: "",
    description: "",
    image_url: "",
    date: new Date().toISOString().split("T")[0], // Today's date
  };

  const [newAchievement, setNewAchievement] = useState<
    typeof initialNewAchievement
  >(initialNewAchievement);

  // Handle file selection for create form
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG or PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle file selection for edit form
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG or PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setEditImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const { uploadFiles } = genUploader<OurFileRouter>();
  const uploadImage = async (file: File): Promise<string> => {
    try {
      setImageUploading(true);
      const res = await uploadFiles("imageUploader", { files: [file] });
      const url = res?.[0]?.ufsUrl ?? "";
      return url;
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image");
      return "";
    } finally {
      setImageUploading(false);
    }
  };

  // Fetch achievements via Prisma
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await adminListAchievements();
      setAchievements(
        data.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          image_url: a.imageUrl || "",
          date: a.date,
        }))
      );
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Filter achievements based on search
  const filteredAchievements = achievements.filter(
    (achievement) =>
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit achievement
  const handleEditAchievement = async () => {
    if (!selectedAchievement) return;

    try {
      setEditLoading(true);

      // Upload image if a new one was selected
      let imageUrl = selectedAchievement.image_url;
      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
      }

      const res = await adminUpdateAchievement(selectedAchievement.id, {
        title: selectedAchievement.title,
        description: selectedAchievement.description,
        imageUrl,
        date: selectedAchievement.date || undefined,
      });
      if (!res.success)
        throw new Error(res.error || "Failed to update achievement");

      // Update local state
      setAchievements(
        achievements.map((a) =>
          a.id === selectedAchievement.id
            ? {
                ...selectedAchievement,
                image_url: imageUrl,
              }
            : a
        )
      );
      setEditDialogOpen(false);
      setSelectedAchievement(null);
      setEditImageFile(null);
      setEditImagePreview("");

      toast.success("Achievement updated successfully");
    } catch (error) {
      console.error("Error updating achievement:", error);
      toast.error("Failed to update achievement");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete achievement
  const handleDeleteAchievement = async () => {
    if (!selectedAchievement) return;

    try {
      setDeleteLoading(true);

      await adminDeleteAchievement(selectedAchievement.id);

      // Remove from local state
      setAchievements(
        achievements.filter((a) => a.id !== selectedAchievement.id)
      );
      setDeleteDialogOpen(false);
      setSelectedAchievement(null);

      toast.success("Achievement deleted successfully");
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Failed to delete achievement");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle create achievement
  const handleCreateAchievement = async () => {
    try {
      setCreateLoading(true);

      // Validate required fields
      if (!newAchievement.title || !newAchievement.description) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Upload image if one was selected
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await adminCreateAchievement({
        title: newAchievement.title,
        description: newAchievement.description,
        imageUrl,
        date: newAchievement.date,
      });
      if (!res.success)
        throw new Error(res.error || "Failed to create achievement");
      setAchievements([
        ...achievements,
        {
          id: res.achievement.id,
          title: res.achievement.title,
          description: res.achievement.description,
          image_url: res.achievement.imageUrl || "",
          date: res.achievement.date,
        },
      ]);
      setCreateDialogOpen(false);
      setNewAchievement(initialNewAchievement);
      setImageFile(null);
      setImagePreview("");

      toast.success("Achievement created successfully");
    } catch (error: any) {
      console.error("Error creating achievement:", error);
      toast.error(error.message || "Failed to create achievement");
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle input changes for edit form
  const handleEditInputChange = (field: keyof Achievement, value: any) => {
    if (selectedAchievement) {
      setSelectedAchievement({ ...selectedAchievement, [field]: value });
    }
  };

  // Handle input changes for create form
  const handleCreateInputChange = (field: string, value: any) => {
    setNewAchievement({ ...newAchievement, [field]: value });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Truncate text for table display
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Achievements Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage club achievements and success stories
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredAchievements.length} achievements
          </Badge>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>All Achievements</span>
          </CardTitle>
          <CardDescription>
            View and manage all club achievements
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
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAchievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {achievement.date
                            ? new Date(achievement.date).toLocaleDateString()
                            : "No date"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {truncateText(achievement.title, 50)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {truncateText(achievement.description, 100)}
                      </TableCell>
                      <TableCell>
                        {achievement.image_url ? (
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">Yes</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">No</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAchievement(achievement);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAchievement(achievement);
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

              {filteredAchievements.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No achievements found matching your criteria.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Achievement Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Achievement</DialogTitle>
            <DialogDescription>
              Update achievement information
            </DialogDescription>
          </DialogHeader>

          {selectedAchievement && (
            <div className="space-y-4 max-h-96 overflow-y-auto px-2 py-2">
              <div>
                <Label htmlFor="edit-title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-title"
                  value={selectedAchievement.title}
                  onChange={(e) =>
                    handleEditInputChange("title", e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="edit-description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedAchievement.description}
                  onChange={(e) =>
                    handleEditInputChange("description", e.target.value)
                  }
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="edit-image">Image</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleEditFileChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  JPG or PNG. Max size 5MB.
                </p>
                {(editImagePreview || selectedAchievement.image_url) && (
                  <div className="mt-2">
                    <img
                      src={editImagePreview || selectedAchievement.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={selectedAchievement.date || ""}
                  onChange={(e) =>
                    handleEditInputChange("date", e.target.value || null)
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditImageFile(null);
                setEditImagePreview("");
              }}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleEditAchievement} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Achievement Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Achievement</DialogTitle>
            <DialogDescription>
              Create a new achievement entry
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto px-2 py-2">
            <div>
              <Label htmlFor="create-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-title"
                value={newAchievement.title}
                onChange={(e) =>
                  handleCreateInputChange("title", e.target.value)
                }
              />
            </div>

            <div>
              <Label htmlFor="create-description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="create-description"
                value={newAchievement.description}
                onChange={(e) =>
                  handleCreateInputChange("description", e.target.value)
                }
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="create-image">Image</Label>
              <Input
                id="create-image"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                JPG or PNG. Max size 5MB.
              </p>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="create-date">Date</Label>
              <Input
                id="create-date"
                type="date"
                value={newAchievement.date}
                onChange={(e) =>
                  handleCreateInputChange("date", e.target.value)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setNewAchievement(initialNewAchievement);
                setImageFile(null);
                setImagePreview("");
              }}
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAchievement} disabled={createLoading}>
              {createLoading ? "Creating..." : "Create Achievement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedAchievement?.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAchievement}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Deleting..." : "Delete Achievement"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
