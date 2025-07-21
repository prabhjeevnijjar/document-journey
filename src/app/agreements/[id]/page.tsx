import { AgreementRecipientsTable } from "@/components/agreement-recipients-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

const sampleRecipients = [
  {
    id: "1",
    name: "psn",
    email: "prabhjeevnijjar@hotmail.com",
    status: "completed" as const,
    lastUpdated: "Jul 19, 2025, 08:16 AM",
    lastUpdatedDate: new Date("2025-07-19T08:16:00"),
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "pending" as const,
    lastUpdated: "Jul 19, 2025, 08:00 AM",
    lastUpdatedDate: new Date("2025-07-19T08:00:00"),
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    status: "viewed" as const,
    lastUpdated: "Jul 19, 2025, 07:45 AM",
    lastUpdatedDate: new Date("2025-07-19T07:45:00"),
  },
]

export default function AgreementViewExamplePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0">
            <ArrowLeft className="w-4 h-4" />
            Back to agreements
          </Button>

          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agreement - sign this bro</h1>
              <p className="text-gray-600 mt-1">Created on July 19, 2025</p>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
              ✓ Completed
            </Badge>
          </div>
        </div>

        {/* Recipients Table */}
        <AgreementRecipientsTable recipients={sampleRecipients} />
      </div>
    </div>
  )
}
