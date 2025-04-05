"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthProvider"
import { Download, Printer } from "lucide-react"
import Image from "next/image"
import DashboardDebugger from "@/components/DashboardDebugger"

export default function IDPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate and download an ID card
    alert("ID card download functionality would be implemented here")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ID Card Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student ID Card</CardTitle>
            <CardDescription>View and print student ID cards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 print:shadow-none">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-white w-full py-2 text-center rounded-t-lg">
                  <h3 className="font-bold">Bangladesh Wadokai Karate Do</h3>
                </div>
                <div className="relative w-24 h-24 mt-4 mb-2 rounded-full overflow-hidden border-2 border-primary">
                  <Image src="/placeholder.svg" alt="Student Photo" layout="fill" objectFit="cover" />
                </div>
                <h3 className="font-bold text-lg">John Doe</h3>
                <p className="text-gray-600 text-sm">Student ID: BWKD-2023-001</p>
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Belt:</span>
                    <span className="text-sm">Yellow</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Branch:</span>
                    <span className="text-sm">Bansree (C Block)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Joined:</span>
                    <span className="text-sm">January 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Valid Until:</span>
                    <span className="text-sm">December 31, 2025</span>
                  </div>
                </div>
                <div className="mt-4 w-full border-t border-gray-200 pt-4 text-center">
                  <p className="text-xs text-gray-500">
                    This card is the property of BWKD and must be returned upon request.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePrint} className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                Print ID Card
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ID Card Status</CardTitle>
            <CardDescription>Current status of your ID card</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="font-medium">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-sm font-medium">
                  Active
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Last Issued:</span>
                <span>January 15, 2023</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Expiration Date:</span>
                <span>December 31, 2025</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Replacement Count:</span>
                <span>0</span>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Request Replacement
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add the debugger component */}
      <DashboardDebugger />
    </div>
  )
}

