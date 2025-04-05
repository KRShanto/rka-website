"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Recent Notifications</CardTitle>
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-4 py-4 border-b last:border-0">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Monthly Fee Reminder</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your monthly fee payment is due in 3 days. Please make the payment to avoid late fees.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <CheckCircle className="h-5 w-5" />
              </Button>
            </div>
          ))}

          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-start space-x-4 py-4 border-b last:border-0 bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-500 dark:text-gray-400">Exam Results Published</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The results of your recent belt exam have been published. Check your profile for details.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <CheckCircle className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Notification settings will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

