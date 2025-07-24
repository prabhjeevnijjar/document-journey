"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Send,
  FileText,
  UserPlus,
  BarChart3,
  CheckCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadges } from "@/components/common/StatusBadges";
import { getActivityIconColor } from "@/components/common/ActivityColorIc";

const quickActions = [
  {
    icon: Send,
    title: "Send for Signature",
    description: "Send document for signing",
    color: "bg-blue-50 text-blue-600",
    url: "/agreements",
  },
  {
    icon: FileText,
    title: "New Document",
    description: "Upload new document",
    color: "bg-green-50 text-green-600",
    url: "/documents",
  },
  {
    icon: UserPlus,
    title: "New Contact",
    description: "Upload new contact",
    color: "bg-orange-50 text-orange-600",
    url: "/contacts",
  },
  {
    icon: BarChart3,
    title: "Activity",
    description: "View recent activity",
    color: "bg-purple-50 text-purple-600",
    url: "/activity",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "sign this bro",
    user: "psn",
    timestamp: "Jul 19, 2025, 08:16 AM",
    status: "completed",
    icon: CheckCircle,
  },
  {
    id: 2,
    title: "sign this bro",
    user: "psn",
    timestamp: "Jul 19, 2025, 08:15 AM",
    status: "opened",
    icon: Mail,
  },
  {
    id: 3,
    title: "sign this bro",
    user: "psn",
    timestamp: "Jul 19, 2025, 08:14 AM",
    status: "sent",
    icon: Send,
  },
  {
    id: 4,
    title: "new-agreement for test",
    user: "pari",
    timestamp: "Jul 19, 2025, 08:10 AM",
    status: "sent",
    icon: Send,
  },
  {
    id: 5,
    title: "axsxsxsxsx",
    user: "pari",
    timestamp: "Jun 25, 2025, 03:36 PM",
    status: "sent",
    icon: Send,
  },
];

const DashboardActions = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-gray-50"
                  onClick={() => router.push(action.url)}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${action.color}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900">
                      {action.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {action.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest document interactions</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => router.push("/activity")}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityIconColor(
                      activity.status
                    )}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {activity.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.user} • {activity.timestamp}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {StatusBadges(activity.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActions;
