export const getActivityIconColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-600";
    case "opened":
      return "bg-blue-50 text-blue-600";
    case "sent":
      return "bg-gray-50 text-gray-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};
