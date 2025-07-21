import { ActivityFeed } from "@/components/activity-feed"

const sampleActivities = [
  {
    id: "1",
    title: "sign this bro",
    user: "psn",
    timestamp: "Jul 19, 2025, 08:16 AM",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "sign this bro",
    user: "psn",
    timestamp: "Jul 19, 2025, 08:15 AM",
    status: "opened" as const,
  },
  {
    id: "3",
    title: "sign this bro",
    user: "psn",
    timestamp: "Jul 19, 2025, 08:14 AM",
    status: "sent" as const,
  },
  {
    id: "4",
    title: "new-agreement for test",
    user: "pari",
    timestamp: "Jul 19, 2025, 08:10 AM",
    status: "sent" as const,
  },
  {
    id: "5",
    title: "axsxsxsxsx",
    user: "pari",
    timestamp: "Jun 25, 2025, 03:36 PM",
    status: "sent" as const,
  },
  {
    id: "6",
    title: "psn",
    user: "Prabhjeev Nijjar",
    timestamp: "Jun 25, 2025, 03:32 PM",
    status: "sent" as const,
  },
]

export default function ActivityDemoPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recent Activity</h1>
        <p className="text-gray-600">Track all recent document activities and signatures</p>
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={sampleActivities} />
    </div>
  )
}
