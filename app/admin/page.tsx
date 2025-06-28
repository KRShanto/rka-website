"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  PROFILES_TABLE,
  PAYMENTS_TABLE,
  ACHIEVEMENTS_TABLE,
  NOTICES_TABLE,
  GALLERY_TABLE,
} from "@/lib/supabase-constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  CreditCard,
  Trophy,
  Bell,
  Images,
  MapPin,
  Shield,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DashboardStats {
  totalStudents: number;
  totalTrainers: number;
  pendingPayments: number;
  confirmedPayments: number;
  totalAchievements: number;
  totalNotices: number;
  totalGalleryImages: number;
  recentPayments: any[];
  recentUsers: any[];
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTrainers: 0,
    pendingPayments: 0,
    confirmedPayments: 0,
    totalAchievements: 0,
    totalNotices: 0,
    totalGalleryImages: 0,
    recentPayments: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch user statistics
      const { data: profiles, error: profileError } = await supabase
        .from(PROFILES_TABLE)
        .select("role, created_at, name")
        .order("created_at", { ascending: false });

      if (profileError) throw profileError;

      const students = profiles?.filter((p) => p.role === "student") || [];
      const trainers = profiles?.filter((p) => p.role === "trainer") || [];

      // Fetch payment statistics
      const { data: payments, error: paymentError } = await supabase
        .from(PAYMENTS_TABLE)
        .select(
          `
          *,
          profiles:user_id (name, email)
        `
        )
        .order("created_at", { ascending: false });

      if (paymentError) throw paymentError;

      const pendingPayments =
        payments?.filter((p) => p.status === "pending") || [];
      const confirmedPayments =
        payments?.filter((p) => p.status === "confirmed") || [];

      // Fetch other statistics
      const [achievementsResult, noticesResult, galleryResult] =
        await Promise.all([
          supabase.from(ACHIEVEMENTS_TABLE).select("id"),
          supabase.from(NOTICES_TABLE).select("id"),
          supabase.from(GALLERY_TABLE).select("id"),
        ]);

      setStats({
        totalStudents: students.length,
        totalTrainers: trainers.length,
        pendingPayments: pendingPayments.length,
        confirmedPayments: confirmedPayments.length,
        totalAchievements: achievementsResult.data?.length || 0,
        totalNotices: noticesResult.data?.length || 0,
        totalGalleryImages: galleryResult.data?.length || 0,
        recentPayments: payments?.slice(0, 5) || [],
        recentUsers: profiles?.slice(0, 5) || [],
      });
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const quickActions = [
    {
      title: "User Management",
      description: "Manage students and trainers",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500",
      count: stats.totalStudents + stats.totalTrainers,
    },
    {
      title: "Payment Management",
      description: "Review payment submissions",
      icon: CreditCard,
      href: "/admin/payments",
      color: "bg-green-500",
      count: stats.pendingPayments,
      badge: stats.pendingPayments > 0 ? "Pending" : null,
    },
    {
      title: "Achievements",
      description: "Manage student achievements",
      icon: Trophy,
      href: "/admin/achievements",
      color: "bg-yellow-500",
      count: stats.totalAchievements,
    },
    {
      title: "Notice Management",
      description: "Create and manage notices",
      icon: Bell,
      href: "/admin/notices",
      color: "bg-purple-500",
      count: stats.totalNotices,
    },
    {
      title: "Gallery Management",
      description: "Upload and manage gallery",
      icon: Images,
      href: "/admin/gallery",
      color: "bg-pink-500",
      count: stats.totalGalleryImages,
    },
    {
      title: "Branch Management",
      description: "Manage dojo branches",
      icon: MapPin,
      href: "/admin/branches",
      color: "bg-indigo-500",
    },
  ];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dojo Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name}! Manage your karate dojo efficiently.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-red-600" />
          <span className="text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
            Dojo Administrator
          </span>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalStudents}
            </div>
            <p className="text-xs text-muted-foreground">
              Active students in dojo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trainers</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalTrainers}
            </div>
            <p className="text-xs text-muted-foreground">Certified trainers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Confirmed Payments
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.confirmedPayments}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Card
              key={action.href}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    {action.count !== undefined && (
                      <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                        {action.count}
                      </div>
                    )}
                    {action.badge && (
                      <Badge
                        variant="outline"
                        className="text-yellow-600 border-yellow-600 mt-1"
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={action.href}>
                    Manage {action.title.split(" ")[0]}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Payments</span>
            </CardTitle>
            <CardDescription>
              Latest payment submissions from students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentPayments.length > 0 ? (
                stats.recentPayments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          payment.status === "pending"
                            ? "bg-yellow-500"
                            : payment.status === "confirmed"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">
                          {payment.profiles?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.type} - {formatAmount(payment.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400">
                        {formatDate(payment.created_at)}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          payment.status === "pending"
                            ? "text-yellow-600 border-yellow-600"
                            : payment.status === "confirmed"
                            ? "text-green-600 border-green-600"
                            : "text-red-600 border-red-600"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent payments
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Registrations</span>
            </CardTitle>
            <CardDescription>
              New students and trainers joined recently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">New {user.role}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent registrations
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Dojo Overview</span>
          </CardTitle>
          <CardDescription>
            Quick overview of your dojo management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalAchievements}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Achievements
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Bell className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalNotices}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Notices
              </p>
            </div>
            <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Images className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-pink-600">
                {stats.totalGalleryImages}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gallery Images
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {stats.confirmedPayments + stats.pendingPayments}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Payments
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
