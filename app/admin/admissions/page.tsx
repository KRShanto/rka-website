"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminListAdmissions,
  adminApproveAdmission,
  adminRejectAdmission,
  type AdminAdmission,
} from "@/actions/admin-admissions";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { CheckCircle, Search, XCircle, UserRound } from "lucide-react";

type Admission = AdminAdmission;

export default function AdmissionsManagement() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "PENDING" | "APPROVED" | "REJECTED"
  >("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const data = await adminListAdmissions();
      setAdmissions(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return admissions.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [admissions, search, statusFilter]);

  const approve = async (id: string) => {
    try {
      setActionLoadingId(id);
      const res = await adminApproveAdmission(id);
      if (!res.success) throw new Error("Approve failed");
      setAdmissions((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a))
      );
      toast.success("Admission approved");
    } catch (e) {
      toast.error("Failed to approve admission");
    } finally {
      setActionLoadingId(null);
    }
  };

  const reject = async (id: string) => {
    try {
      setActionLoadingId(id);
      const res = await adminRejectAdmission(id);
      if (!res.success) throw new Error("Reject failed");
      setAdmissions((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" } : a))
      );
      toast.success("Admission rejected");
    } catch (e) {
      toast.error("Failed to reject admission");
    } finally {
      setActionLoadingId(null);
    }
  };

  const statusBadge = (status: Admission["status"]) => {
    if (status === "PENDING")
      return (
        <Badge
          variant="outline"
          className="text-yellow-600 border-yellow-600 text-xs px-2 py-0.5"
        >
          Pending
        </Badge>
      );
    if (status === "APPROVED")
      return (
        <Badge
          variant="outline"
          className="text-green-600 border-green-600 text-xs px-2 py-0.5"
        >
          Approved
        </Badge>
      );
    if (status === "REJECTED")
      return (
        <Badge
          variant="outline"
          className="text-red-600 border-red-600 text-xs px-2 py-0.5"
        >
          Rejected
        </Badge>
      );
    return (
      <Badge variant="outline" className="text-xs px-2 py-0.5">
        {status}
      </Badge>
    );
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review, approve or reject new admissions
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filtered.length} records
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserRound className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
          <CardDescription>Search and filter admissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Name, email or phone"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label>Status</Label>
              <div className="flex gap-2 pt-2">
                {(["all", "PENDING", "APPROVED", "REJECTED"] as const).map(
                  (s) => (
                    <Button
                      key={s}
                      variant={statusFilter === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(s)}
                    >
                      {s.toString()}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserRound className="w-5 h-5" />
            <span>Admission Requests</span>
          </CardTitle>
          <CardDescription>Click a row to view quick details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No admissions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Applicant</TableHead>
                    <TableHead className="w-16">Gender</TableHead>
                    <TableHead className="w-16">Blood</TableHead>
                    <TableHead className="w-24">DOB</TableHead>
                    <TableHead className="w-32">Email</TableHead>
                    <TableHead className="w-24">Phone</TableHead>
                    <TableHead className="w-32">bKash Transaction</TableHead>
                    <TableHead className="w-20">Status</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-14 w-14 rounded-md">
                            {a.imageUrl ? (
                              <AvatarImage
                                src={a.imageUrl}
                                alt={a.name}
                                className="rounded-md"
                              />
                            ) : (
                              <AvatarFallback className="text-sm rounded-md">
                                {a.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{a.name}</div>
                            <div className="text-xs text-gray-500">
                              {a.fatherName} & {a.motherName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {a.gender === "MALE" ? "M" : "F"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {a.bloodGroup
                          ? a.bloodGroup
                              .replace("_POS", "+")
                              .replace("_NEG", "-")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(a.dateOfBirth)}
                      </TableCell>
                      <TableCell className="text-xs truncate max-w-32">
                        {a.email}
                      </TableCell>
                      <TableCell className="text-sm">{a.phone}</TableCell>
                      <TableCell className="text-xs">
                        {a.bkashTransactionId ? (
                          <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-sm">
                            {a.bkashTransactionId}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">
                            No payment
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{statusBadge(a.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => reject(a.id)}
                            disabled={
                              actionLoadingId === a.id ||
                              a.status === "REJECTED"
                            }
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
                          >
                            <XCircle className="w-3 h-3 mr-1" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                            onClick={() => approve(a.id)}
                            disabled={
                              actionLoadingId === a.id ||
                              a.status === "APPROVED"
                            }
                          >
                            <CheckCircle className="w-3 h-3 mr-1" /> Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
