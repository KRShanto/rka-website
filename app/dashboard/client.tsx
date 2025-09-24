"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import Image from "next/image";
import { DbUser } from "@/lib/auth";
import moment from "moment";
import { toast } from "sonner";

export default function PageClient({
  user,
}: {
  user: DbUser & { branch: { name: string } };
}) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.info("ID card download will be implemented");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Student ID Card</CardTitle>
            <CardDescription>
              View and print your student ID card
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 print:shadow-none">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-white w-full py-2 text-center rounded-t-lg">
                  <h3 className="font-bold">Roni Karate Academy</h3>
                </div>
                <div className="relative w-24 h-24 mt-4 mb-2 rounded-full overflow-hidden border-2 border-primary">
                  <Image
                    src={user.imageUrl || "/placeholder.svg"}
                    alt={`${user.name || "Student"} Photo`}
                    width={96}
                    height={96}
                    priority
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-gray-600 text-sm">
                  Student ID: {user.username}
                </p>
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Belt:</span>
                    <span className="text-sm">{user.currentBelt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Branch:</span>
                    <span className="text-sm">
                      {user.branch?.name || "No Branch Assigned"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Joined:</span>
                    <span className="text-sm">
                      {user.joinDate
                        ? moment(user.joinDate).format("DD/MM/YYYY")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">Valid Until:</span>
                    <span className="text-sm">
                      {user.joinDate
                        ? moment(user.joinDate)
                            .add(1, "year")
                            .format("DD/MM/YYYY")
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 w-full border-t border-gray-200 pt-4 text-center">
                  <p className="text-xs text-gray-500">
                    This card is the property of RKAD and must be returned upon
                    request.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePrint} className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                Print ID Card
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
