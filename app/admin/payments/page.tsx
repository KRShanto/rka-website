"use client";

import { useState, useEffect } from "react";
import {
  adminListPayments,
  adminConfirmPayment,
  adminDeletePayment,
} from "@/actions/admin-payments";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  Trash2,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Payment {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  student_id: string;
  bkash_transaction_id: string | null;
  status: string;
  user_id: string;
  profiles: {
    id: string;
    name: string;
    email: string | null;
    profile_image_url: string | null;
  };
}

export default function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch payments via Prisma with user details
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await adminListPayments();
      setPayments(data as any);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments based on search and filters
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.profiles?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      payment.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.bkash_transaction_id ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || payment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle row click to open details modal
  const handleRowClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsDialogOpen(true);
  };

  // Handle confirm payment
  const handleConfirmPayment = async () => {
    if (!selectedPayment) return;

    try {
      setActionLoading(true);
      const res = await adminConfirmPayment(selectedPayment.id);
      if (!res.success) throw new Error("Failed to confirm");

      // Update local state
      setPayments(
        payments.map((p) =>
          p.id === selectedPayment.id ? { ...p, status: "confirmed" } : p
        )
      );

      setDetailsDialogOpen(false);
      setSelectedPayment(null);
      toast.success("Payment confirmed successfully");
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Failed to confirm payment");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete payment
  const handleDeletePayment = async () => {
    if (!selectedPayment) return;

    try {
      setActionLoading(true);
      const res = await adminDeletePayment(selectedPayment.id);
      if (!res.success) throw new Error("Failed to delete");

      // Remove from local state
      setPayments(payments.filter((p) => p.id !== selectedPayment.id));
      setDeleteDialogOpen(false);
      setDetailsDialogOpen(false);
      setSelectedPayment(null);

      toast.success("Payment deleted successfully");
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Failed to delete payment");
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get type display name
  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case "monthly":
        return "Monthly fee";
      case "exam":
        return "Exam fee";
      case "registration":
        return "Registration Fee";
      case "event":
        return "Event/competition fee";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and manage payment submissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredPayments.length} payments
          </Badge>
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
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Payments</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name, student ID, or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="type-filter">Filter by Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="monthly">Monthly fee</SelectItem>
                  <SelectItem value="exam">Exam fee</SelectItem>
                  <SelectItem value="registration">Registration Fee</SelectItem>
                  <SelectItem value="event">Event/competition fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Submissions</span>
          </CardTitle>
          <CardDescription>
            Click on any row to view details and manage the payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payments found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleRowClick(payment)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            {payment.profiles?.profile_image_url ? (
                              <AvatarImage
                                src={payment.profiles.profile_image_url}
                                alt={payment.profiles.name}
                              />
                            ) : (
                              <AvatarFallback>
                                {payment.profiles?.name
                                  ?.charAt(0)
                                  .toUpperCase() || "?"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {payment.profiles?.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {payment.student_id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {getTypeDisplayName(payment.type)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-semibold text-green-600">
                          {formatAmount(payment.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {payment.bkash_transaction_id || "—"}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {formatDate(payment.created_at)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Details</span>
            </DialogTitle>
            <DialogDescription>
              Review payment information and take action
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6">
              {/* Student Information */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="h-12 w-12">
                  {selectedPayment.profiles?.profile_image_url ? (
                    <AvatarImage
                      src={selectedPayment.profiles.profile_image_url}
                      alt={selectedPayment.profiles.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {selectedPayment.profiles?.name
                        ?.charAt(0)
                        .toUpperCase() || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedPayment.profiles?.name || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedPayment.profiles?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    Student ID: {selectedPayment.student_id}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Payment Type
                  </Label>
                  <p className="text-lg font-semibold">
                    {getTypeDisplayName(selectedPayment.type)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Amount
                  </Label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatAmount(selectedPayment.amount)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Transaction ID
                  </Label>
                  <p className="text-lg font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                    {selectedPayment.bkash_transaction_id}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Status
                  </Label>
                  <div className="pt-1">
                    {getStatusBadge(selectedPayment.status)}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">
                    Submitted
                  </Label>
                  <p className="text-lg">
                    {formatDate(selectedPayment.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setDetailsDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={actionLoading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            {selectedPayment?.status === "pending" && (
              <Button
                onClick={handleConfirmPayment}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {actionLoading ? "Confirming..." : "Confirm"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayment}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
