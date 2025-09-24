"use client";

import { useState, useEffect } from "react";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Images,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  adminListGallery,
  adminCreateGalleryItems,
  adminDeleteGalleryItem,
} from "@/actions/admin-gallery";

interface GalleryItem {
  id: string;
  url: string;
  created_at: string;
}

export default function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Zoom functionality
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { uploadFiles } = genUploader<OurFileRouter>();

  // Fetch gallery items via Prisma
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await adminListGallery();
      setItems(data);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Upload images via UploadThing
  const uploadImage = async (file: File): Promise<string> => {
    const res = await uploadFiles("imageUploader", { files: [file] });
    const url = res?.[0]?.ufsUrl;
    if (!url) throw new Error("Failed to upload image");
    return url;
  };

  // Handle file selection
  const handleFilesChange = (files: File[]) => {
    if (files.length > 0) {
      setImageFiles(files);

      const previews: string[] = [];
      let loadedCount = 0;

      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          previews[index] = reader.result as string;
          loadedCount++;
          if (loadedCount === files.length) {
            setImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle input file change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFilesChange(files);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      handleFilesChange(files);
    }
  };

  // Handle upload images
  const handleUploadImages = async () => {
    try {
      setUploadLoading(true);

      if (imageFiles.length === 0) {
        toast.error("Please select at least one image");
        return;
      }

      const imageUrls = await Promise.all(
        imageFiles.map((file) => uploadImage(file))
      );
      const res = await adminCreateGalleryItems(imageUrls);
      if (!res.success) throw new Error(res.error || "Failed to add images");
      setItems([...res.items, ...items]);
      setImageFiles([]);
      setImagePreviews([]);

      toast.success(`${res.items.length} images uploaded successfully`);
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle delete gallery item
  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      setDeleteLoading(true);

      await adminDeleteGalleryItem(selectedItem.id);

      // Remove from local state
      setItems(items.filter((item) => item.id !== selectedItem.id));
      setDeleteDialogOpen(false);
      setSelectedItem(null);

      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Remove image from preview
  const removePreviewImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Zoom functions
  const handleViewImage = (imageUrl: string) => {
    setViewingImage(imageUrl);
    setViewDialogOpen(true);
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleCloseViewer = () => {
    setViewDialogOpen(false);
    setViewingImage(null);
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    if (delta < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gallery Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload and manage gallery images
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {items.length} images
          </Badge>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Images</span>
          </CardTitle>
          <CardDescription>
            Drag and drop images or click to select multiple files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drop your images here
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                or click to browse files
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer"
              >
                Select Images
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    Selected Images ({imagePreviews.length})
                  </h3>
                  <Button
                    onClick={handleUploadImages}
                    disabled={uploadLoading}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadLoading ? "Uploading..." : "Upload All"}</span>
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removePreviewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Images className="w-5 h-5" />
            <span>Gallery Images</span>
          </CardTitle>
          <CardDescription>All uploaded gallery images</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No images uploaded yet. Upload some images to get started.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                      src={item.url}
                      alt="Gallery image"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewImage(item.url)}
                        className="opacity-0 group-hover:opacity-100 bg-blue-500 text-white p-2 rounded-full transition-opacity hover:bg-blue-600"
                        title="View image"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setDeleteDialogOpen(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-opacity hover:bg-red-600"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Viewer with Zoom */}
      {viewDialogOpen && viewingImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseViewer}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-black z-20 hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseViewer();
              }}
            >
              <X size={24} />
            </button>

            {/* Zoom controls */}
            <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="bg-white rounded-full p-2 text-black hover:bg-gray-100 transition-colors"
                title="Zoom in"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="bg-white rounded-full p-2 text-black hover:bg-gray-100 transition-colors"
                title="Zoom out"
              >
                <ZoomOut size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetZoom();
                }}
                className="bg-white rounded-full p-2 text-black hover:bg-gray-100 transition-colors"
                title="Reset zoom"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            {/* Zoom indicator */}
            <div className="absolute bottom-4 left-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {Math.round(zoom * 100)}%
            </div>

            {/* Image container */}
            <div
              className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                  transform: `scale(${zoom}) translate(${panX / zoom}px, ${
                    panY / zoom
                  }px)`,
                  transition: isDragging ? "none" : "transform 0.2s ease-out",
                }}
              >
                <Image
                  src={viewingImage}
                  alt="Gallery image"
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  style={{ maxHeight: "90vh", maxWidth: "90vw" }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 right-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              Scroll to zoom • Drag to pan
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
