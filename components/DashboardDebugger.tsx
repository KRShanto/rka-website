"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthProvider"

export default function DashboardDebugger() {
  const { user, logout } = useAuth()
  const [visible, setVisible] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button size="sm" variant="outline" onClick={() => setVisible(!visible)} className="bg-white dark:bg-gray-800">
        Debug
      </Button>

      {visible && (
        <div className="absolute bottom-10 left-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-64">
          <h3 className="font-bold mb-2">Dashboard Debug</h3>
          <div className="text-xs mb-2 overflow-auto max-h-40">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="destructive" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

