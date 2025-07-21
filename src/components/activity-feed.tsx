import { Badge } from "@/components/ui/badge"
import { CheckCircle, Mail, Send } from "lucide-react"

interface ActivityItem {
  id: string
  title: string
  user: string
  timestamp: string
  status: "completed" | "opened" | "sent"
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  title?: string
  description?: string
}

const getActivityIcon = (status: ActivityItem["status"]) => {
  switch (status) {
    case "completed":
      return CheckCircle
    case "opened":
      return Mail
    case "sent":
      return Send
    default:
      return Send
  }
}

const getStatusBadge = (status: ActivityItem["status"]) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
          Completed
        </Badge>
      )
    case "opened":
      return (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
          Opened
        </Badge>
      )
    case "sent":
      return (
        <Badge variant="secondary" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
          Sent
        </Badge>
      )
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

const getIconColor = (status: ActivityItem["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-600"
    case "opened":
      return "bg-blue-50 text-blue-600"
    case "sent":
      return "bg-gray-50 text-gray-600"
    default:
      return "bg-gray-50 text-gray-600"
  }
}

export function ActivityFeed({
  activities,
  title = "Activity Feed",
  description = "Latest updates on your documents and signatures",
}: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = getActivityIcon(activity.status)
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(activity.status)}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                      <div className="flex-shrink-0">{getStatusBadge(activity.status)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
