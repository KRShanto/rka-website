"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Download, FileText, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample payment history data
const paymentHistoryData = [
  {
    id: "PAY-2023-001",
    date: "2023-04-05",
    type: "Monthly Fee",
    amount: 1500,
    status: "completed",
    method: "Credit Card",
    receipt: true,
  },
  {
    id: "PAY-2023-002",
    date: "2023-05-03",
    type: "Monthly Fee",
    amount: 1500,
    status: "completed",
    method: "bKash",
    receipt: true,
  },
  {
    id: "PAY-2023-003",
    date: "2023-06-10",
    type: "Monthly Fee",
    amount: 1500,
    status: "completed",
    method: "Credit Card",
    receipt: true,
  },
  {
    id: "PAY-2023-004",
    date: "2023-07-08",
    type: "Exam Fee",
    amount: 2000,
    status: "completed",
    method: "Nagad",
    receipt: true,
  },
  {
    id: "PAY-2023-005",
    date: "2023-08-05",
    type: "Monthly Fee",
    amount: 1500,
    status: "completed",
    method: "Credit Card",
    receipt: true,
  },
  {
    id: "PAY-2023-006",
    date: "2023-09-07",
    type: "Monthly Fee",
    amount: 1500,
    status: "completed",
    method: "bKash",
    receipt: true,
  },
  {
    id: "PAY-2023-007",
    date: "2023-10-06",
    type: "Monthly Fee",
    amount: 1500,
    status: "completed",
    method: "Credit Card",
    receipt: true,
  },
  {
    id: "PAY-2023-008",
    date: "2023-11-05",
    type: "Equipment Purchase",
    amount: 3500,
    status: "completed",
    method: "Credit Card",
    receipt: true,
  },
  {
    id: "PAY-2023-009",
    date: "2023-12-07",
    type: "Monthly Fee",
    amount: 1500,
    status: "completed",
    method: "bKash",
    receipt: true,
  },
  {
    id: "PAY-2024-001",
    date: "2024-01-08",
    type: "Monthly Fee",
    amount: 1500,
    status: "completed",
    method: "Credit Card",
    receipt: true,
  },
  {
    id: "PAY-2024-002",
    date: "2024-02-06",
    type: "Monthly Fee",
    amount: 1500,
    status: "completed",
    method: "Nagad",
    receipt: true,
  },
  {
    id: "PAY-2024-003",
    date: "2024-03-05",
    type: "Monthly Fee",
    amount: 1500,
    status: "pending",
    method: "Credit Card",
    receipt: false,
  },
]

export default function PaymentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const itemsPerPage = 5

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Filter and paginate data
  const filteredData = paymentHistoryData.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesType = typeFilter === "all" || payment.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleDownloadReceipt = (paymentId: string) => {
    alert(`Downloading receipt for payment ${paymentId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Payments</CardTitle>
          <CardDescription>Search and filter your payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="mb-2">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="search"
                  placeholder="Search by ID, type, or method"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status-filter" className="mb-2">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type-filter" className="mb-2">
                Payment Type
              </Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Monthly Fee">Monthly Fee</SelectItem>
                  <SelectItem value="Registration Fee">Registration Fee</SelectItem>
                  <SelectItem value="Exam Fee">Exam Fee</SelectItem>
                  <SelectItem value="Equipment Purchase">Equipment Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>
            Showing {paginatedData.length} of {filteredData.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell>{payment.amount.toLocaleString()} BDT</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "success"
                              : payment.status === "pending"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        {payment.receipt ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReceipt(payment.id)}
                            className="flex items-center space-x-1"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View</span>
                          </Button>
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No payment records found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Payment History</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

