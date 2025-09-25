"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Filter,
  Shield,
  Upload,
  X,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  adminCreateUser,
  adminDeleteUser,
  adminUpdateUser,
  adminGetNextUsername,
  adminCheckUsernameAvailability,
  type AdminUser,
} from "@/actions/admin-users";

type Branch = { id: string; name: string };

type Props = {
  users: AdminUser[];
  branches: Branch[];
  currentUserId: string;
};

export default function UsersClient({
  users: initialUsers,
  branches,
  currentUserId,
}: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [createImageFile, setCreateImageFile] = useState<File | null>(null);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    password?: string;
  }>({});
  const { uploadFiles } = genUploader<OurFileRouter>();

  type NewUserState = {
    name: string;
    username: string;
    email: string;
    phone: string;
    mother_name: string;
    father_name: string;
    profile_image_url: string;
    current_belt: string;
    current_dan: number;
    weight: number;
    gender: "male" | "female";
    branch: string | null;
    role: "student" | "trainer";
    is_admin: boolean;
    password: string;
  };

  const initialNewUser: NewUserState = {
    name: "",
    username: "",
    email: "",
    phone: "",
    mother_name: "",
    father_name: "",
    profile_image_url: "",
    current_belt: "white",
    current_dan: 1,
    weight: 0,
    gender: "male",
    branch: null,
    role: "student",
    is_admin: false,
    password: "",
  };
  const [newUser, setNewUser] = useState<NewUserState>(initialNewUser);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const uploadImage = async (file: File) => {
    try {
      setImageUploading(true);
      const res = await uploadFiles("imageUploader", { files: [file] });
      const url = res?.[0]?.ufsUrl;
      if (!url) throw new Error("Upload failed");
      return url;
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    if (isEdit) {
      setEditImageFile(file);
    } else {
      setCreateImageFile(file);
    }
  };

  const getBranchName = (branchId: string | null) => {
    if (!branchId) return "No Branch";
    const b = branches.find((x) => x.id === branchId);
    return b?.name ?? "Unknown Branch";
  };

  const getBeltColor = (belt?: string | null) => {
    const colors: Record<string, string> = {
      white: "bg-gray-100 text-gray-800",
      yellow: "bg-yellow-100 text-yellow-800",
      orange: "bg-orange-100 text-orange-800",
      "green-junior": "bg-green-100 text-green-800",
      "green-senior": "bg-green-200 text-green-900",
      "blue-junior": "bg-blue-100 text-blue-800",
      "blue-senior": "bg-blue-200 text-blue-900",
      "brown-junior": "bg-amber-100 text-amber-800",
      "brown-senior": "bg-amber-200 text-amber-900",
      "black-belt": "bg-gray-900 text-white",
    };
    return colors[belt || "white"] || "bg-gray-100 text-gray-800";
  };

  // Username generation and validation functions
  const generateNextUsername = async () => {
    try {
      setUsernameLoading(true);
      const { nextUsername } = await adminGetNextUsername();
      setNewUser((prev) => ({ ...prev, username: nextUsername }));
      setUsernameValidation({
        isValid: true,
        message: "Auto-generated username",
      });
      toast.success(`Generated username: ${nextUsername}`);
    } catch (error) {
      toast.error("Failed to generate username");
    } finally {
      setUsernameLoading(false);
    }
  };

  const validateUsername = async (username: string) => {
    if (!username.trim()) {
      setUsernameValidation(null);
      return;
    }

    if (username.trim().length < 3) {
      setUsernameValidation({
        isValid: false,
        message: "Username must be at least 3 characters long",
      });
      return;
    }

    try {
      const { isAvailable } = await adminCheckUsernameAvailability(
        username.trim()
      );
      setUsernameValidation({
        isValid: isAvailable,
        message: isAvailable
          ? "Username is available"
          : "Username is already taken",
      });
    } catch (error) {
      setUsernameValidation({
        isValid: false,
        message: "Error checking username availability",
      });
    }
  };

  // Validation function for required fields
  const validateRequiredFields = () => {
    const errors: { name?: string; password?: string } = {};

    if (!newUser.name.trim()) {
      errors.name = "Name is required";
    }
    if (!newUser.password.trim()) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      setEditLoading(true);
      let uploadedUrl: string | undefined = undefined;
      if (editImageFile) {
        uploadedUrl = await uploadImage(editImageFile);
      }
      await adminUpdateUser({
        id: selectedUser.id,
        name: selectedUser.name,
        username: selectedUser.username,
        email: selectedUser.email,
        phone: selectedUser.phone,
        mother_name: selectedUser.mother_name,
        father_name: selectedUser.father_name,
        profile_image_url:
          uploadedUrl ?? selectedUser.profile_image_url ?? null,
        current_belt: selectedUser.current_belt,
        current_dan: selectedUser.current_dan ?? undefined,
        weight: selectedUser.weight ?? undefined,
        gender: selectedUser.gender,
        branch: selectedUser.branch,
        role: selectedUser.role,
        is_admin: selectedUser.is_admin,
      });
      const updated = {
        ...selectedUser,
        profile_image_url:
          uploadedUrl ?? selectedUser.profile_image_url ?? null,
      };
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? updated : u))
      );
      setEditDialogOpen(false);
      setSelectedUser(null);
      setEditImageFile(null);
      setImagePreview(null);
      toast.success("User updated successfully");
    } catch (e) {
      toast.error("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (selectedUser.id === currentUserId) {
      toast.error("You cannot delete your own account");
      return;
    }
    try {
      setDeleteLoading(true);
      await adminDeleteUser(selectedUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      toast.success("User deleted successfully");
    } catch (e) {
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateUser = async () => {
    // Validate required fields
    if (!validateRequiredFields()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!newUser.username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (usernameValidation?.isValid === false) {
      toast.error("Please fix username issues before creating user");
      return;
    }

    try {
      setCreateLoading(true);
      let uploadedUrl: string | undefined = undefined;
      if (createImageFile) {
        uploadedUrl = await uploadImage(createImageFile);
      }
      const res = await adminCreateUser({
        name: newUser.name,
        username: newUser.username,
        email: newUser.email || undefined,
        password: newUser.password,
        phone: newUser.phone,
        mother_name: newUser.mother_name,
        father_name: newUser.father_name,
        profile_image_url:
          (uploadedUrl ?? newUser.profile_image_url) || undefined,
        current_belt: newUser.current_belt,
        current_dan: newUser.current_dan,
        weight: newUser.weight,
        gender: newUser.gender,
        branch: newUser.branch,
        role: newUser.role,
        is_admin: newUser.is_admin,
      });
      if (!res.success) throw new Error("Failed to create user");
      setUsers((prev) => [res.user, ...prev]);
      setCreateDialogOpen(false);
      setNewUser(initialNewUser);
      setImagePreview(null);
      setCreateImageFile(null);
      setUsernameValidation(null);
      setFieldErrors({});
      toast.success("User created successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredUsers.length} users
          </Badge>
          <Button
            onClick={async () => {
              setCreateDialogOpen(true);
              setImagePreview(null);
              setUsernameValidation(null);
              // Auto-generate username when opening create dialog
              try {
                const { nextUsername } = await adminGetNextUsername();
                setNewUser((prev) => ({ ...prev, username: nextUsername }));
                setUsernameValidation({
                  isValid: true,
                  message: "Auto-generated username",
                });
              } catch (error) {
                // If auto-generation fails, user can still manually enter or click the Auto button
                console.error("Failed to auto-generate username:", error);
              }
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

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
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name, username, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="role-filter">Filter by Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger id="role-filter">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="trainer">Trainers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>All Users</span>
          </CardTitle>
          <CardDescription>
            View and manage all registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Belt</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          {user.profile_image_url ? (
                            <AvatarImage
                              src={user.profile_image_url}
                              alt={user.name}
                            />
                          ) : (
                            <AvatarFallback>
                              {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <span>{user.name}</span>
                            {user.is_admin && (
                              <span title="Administrator">
                                <Shield className="w-4 h-4 text-red-500" />
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.gender === "male" ? "Male" : "Female"} •{" "}
                            {user.weight ?? 0}kg
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {user.email || (
                        <span className="text-gray-500 italic">No email</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "trainer" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          getBeltColor(user.current_belt)
                        )}
                      >
                        {(user.current_belt || "").replace("-", " ")}
                        {user.current_belt === "black-belt" &&
                          (user.current_dan ?? 1) > 1 && (
                            <span className="ml-1">
                              ({user.current_dan} Dan)
                            </span>
                          )}
                      </Badge>
                    </TableCell>
                    <TableCell>{getBranchName(user.branch)}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditDialogOpen(true);
                            setImagePreview(null);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={user.id === currentUserId}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(o) => {
          setEditDialogOpen(o);
          if (!o) setImagePreview(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 max-h-96 overflow-y-auto px-2 py-2">
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      {imagePreview || selectedUser.profile_image_url ? (
                        <AvatarImage
                          src={
                            imagePreview || selectedUser.profile_image_url || ""
                          }
                          alt={selectedUser.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {selectedUser.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {imageUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("edit-image-upload")?.click()
                        }
                        disabled={imageUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {imageUploading ? "Uploading..." : "Upload Image"}
                      </Button>
                      {(imagePreview || selectedUser.profile_image_url) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setImagePreview(null);
                            setSelectedUser({
                              ...selectedUser,
                              profile_image_url: "",
                            });
                          }}
                          disabled={imageUploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <input
                      id="edit-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or WebP. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={selectedUser.username}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    placeholder="Optional email address"
                    value={selectedUser.email || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={selectedUser.phone || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select
                    value={selectedUser.gender || "male"}
                    onValueChange={(value) =>
                      setSelectedUser({
                        ...selectedUser,
                        gender: value as "male" | "female",
                      })
                    }
                  >
                    <SelectTrigger id="edit-gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-branch">Branch</Label>
                  <Select
                    value={selectedUser.branch || "none"}
                    onValueChange={(value) =>
                      setSelectedUser({
                        ...selectedUser,
                        branch: value === "none" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger id="edit-branch">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Branch</SelectItem>
                      {branches.map((b, i) => (
                        <SelectItem key={i} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value) =>
                      setSelectedUser({
                        ...selectedUser,
                        role: value as "student" | "trainer",
                      })
                    }
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-belt">Current Belt</Label>
                  <Select
                    value={selectedUser.current_belt || "white"}
                    onValueChange={(value) =>
                      setSelectedUser({ ...selectedUser, current_belt: value })
                    }
                  >
                    <SelectTrigger id="edit-belt">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="green-junior">Green Junior</SelectItem>
                      <SelectItem value="green-senior">Green Senior</SelectItem>
                      <SelectItem value="blue-junior">Blue Junior</SelectItem>
                      <SelectItem value="blue-senior">Blue Senior</SelectItem>
                      <SelectItem value="brown-junior">Brown Junior</SelectItem>
                      <SelectItem value="brown-senior">Brown Senior</SelectItem>
                      <SelectItem value="black-belt">Black Belt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedUser.current_belt === "black-belt" && (
                <div>
                  <Label htmlFor="edit-dan">Dan Level</Label>
                  <Select
                    value={(selectedUser.current_dan ?? 1).toString()}
                    onValueChange={(value) =>
                      setSelectedUser({
                        ...selectedUser,
                        current_dan: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger id="edit-dan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dan) => (
                        <SelectItem key={dan} value={String(dan)}>
                          {dan} Dan
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-admin"
                  checked={selectedUser.is_admin}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      is_admin: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <Label htmlFor="edit-admin">Administrator privileges</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setImagePreview(null);
              }}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onOpenChange={(o) => {
          setCreateDialogOpen(o);
          if (!o) {
            setImagePreview(null);
            setUsernameValidation(null);
            setFieldErrors({});
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user account with profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto px-2 py-2">
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {imagePreview || newUser.profile_image_url ? (
                      <AvatarImage
                        src={imagePreview || newUser.profile_image_url}
                        alt="Preview"
                      />
                    ) : (
                      <AvatarFallback>
                        <Upload className="w-8 h-8 text-gray-400" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {imageUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("create-image-upload")?.click()
                      }
                      disabled={imageUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {imageUploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    {(imagePreview || newUser.profile_image_url) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setImagePreview(null);
                          setNewUser((prev) => ({
                            ...prev,
                            profile_image_url: "",
                          }));
                        }}
                        disabled={imageUploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    id="create-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, false)}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG or WebP. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="create-name"
                  value={newUser.name}
                  onChange={(e) => {
                    setNewUser((p) => ({ ...p, name: e.target.value }));
                    // Clear error when user starts typing
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  className={cn(fieldErrors.name && "border-red-500")}
                />
                {fieldErrors.name && (
                  <p className="text-xs mt-1 text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="create-username">
                  Username <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="create-username"
                    value={newUser.username}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewUser((p) => ({ ...p, username: value }));
                      validateUsername(value);
                    }}
                    className={cn(
                      usernameValidation?.isValid === false && "border-red-500"
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateNextUsername}
                    disabled={usernameLoading}
                    title="Generate next username (d101, d102, etc.)"
                  >
                    {usernameLoading ? (
                      <RotateCcw className="w-4 h-4 animate-spin" />
                    ) : (
                      "Auto"
                    )}
                  </Button>
                </div>
                {usernameValidation && (
                  <p
                    className={cn(
                      "text-xs mt-1",
                      usernameValidation.isValid
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {usernameValidation.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="create-phone">Phone</Label>
                <Input
                  id="create-phone"
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="create-password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="create-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => {
                    setNewUser((p) => ({ ...p, password: e.target.value }));
                    // Clear error when user starts typing
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  className={cn(fieldErrors.password && "border-red-500")}
                />
                {fieldErrors.password && (
                  <p className="text-xs mt-1 text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-father-name">Father's Name</Label>
                <Input
                  id="create-father-name"
                  value={newUser.father_name}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, father_name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="create-mother-name">Mother's Name</Label>
                <Input
                  id="create-mother-name"
                  value={newUser.mother_name}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, mother_name: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-branch">Branch</Label>
                <Select
                  value={newUser.branch || "none"}
                  onValueChange={(value) =>
                    setNewUser((p) => ({
                      ...p,
                      branch: value === "none" ? null : value,
                    }))
                  }
                >
                  <SelectTrigger id="create-branch">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Branch</SelectItem>
                    {branches.map((b, i) => (
                      <SelectItem key={i} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-weight">Weight (kg)</Label>
                <Input
                  id="create-weight"
                  type="number"
                  value={newUser.weight}
                  onChange={(e) =>
                    setNewUser((p) => ({
                      ...p,
                      weight: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-gender">Gender</Label>
                <Select
                  value={newUser.gender}
                  onValueChange={(value) =>
                    setNewUser((p) => ({
                      ...p,
                      gender: value as "male" | "female",
                    }))
                  }
                >
                  <SelectTrigger id="create-gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="create-role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser((p) => ({
                      ...p,
                      role: value as "student" | "trainer",
                    }))
                  }
                >
                  <SelectTrigger id="create-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="create-belt">Current Belt</Label>
                <Select
                  value={newUser.current_belt}
                  onValueChange={(value) =>
                    setNewUser((p) => ({ ...p, current_belt: value }))
                  }
                >
                  <SelectTrigger id="create-belt">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="green-junior">Green Junior</SelectItem>
                    <SelectItem value="green-senior">Green Senior</SelectItem>
                    <SelectItem value="blue-junior">Blue Junior</SelectItem>
                    <SelectItem value="blue-senior">Blue Senior</SelectItem>
                    <SelectItem value="brown-junior">Brown Junior</SelectItem>
                    <SelectItem value="brown-senior">Brown Senior</SelectItem>
                    <SelectItem value="black-belt">Black Belt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newUser.current_belt === "black-belt" && (
                <div>
                  <Label htmlFor="create-dan">Dan Level</Label>
                  <Select
                    value={String(newUser.current_dan)}
                    onValueChange={(value) =>
                      setNewUser((p) => ({
                        ...p,
                        current_dan: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger id="create-dan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dan) => (
                        <SelectItem key={dan} value={String(dan)}>
                          {dan} Dan
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="create-admin"
                checked={newUser.is_admin}
                onChange={(e) =>
                  setNewUser((p) => ({ ...p, is_admin: e.target.checked }))
                }
                className="rounded"
              />
              <Label htmlFor="create-admin">Administrator privileges</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setNewUser(initialNewUser);
                setImagePreview(null);
                setUsernameValidation(null);
                setFieldErrors({});
              }}
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={
                createLoading ||
                !newUser.name.trim() ||
                !newUser.username.trim() ||
                !newUser.password.trim() ||
                usernameValidation?.isValid === false
              }
            >
              {createLoading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
