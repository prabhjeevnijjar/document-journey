import { Badge } from "@/components/ui/badge";

export const StatusBadges = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="secondary"
          className="bg-green-50 text-green-700 hover:bg-green-50"
        >
          Completed
        </Badge>
      );
    case "opened":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-50 text-blue-700 hover:bg-blue-50"
        >
          Opened
        </Badge>
      );
    case "sent":
      return (
        <Badge
          variant="secondary"
          className="bg-gray-50 text-gray-700 hover:bg-gray-50"
        >
          Sent
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};
