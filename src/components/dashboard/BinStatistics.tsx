
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export function BinStatistics() {
  const statistics = [
    {
      title: "Average Fill Rate",
      value: "12% / day",
      icon: <Trash2 className="h-5 w-5 text-eco-500" />,
      description: "Based on the last 7 days",
    },
    {
      title: "Collection Frequency",
      value: "Every 2 days",
      icon: <Trash2 className="h-5 w-5 text-eco-500" />,
      description: "Recommended schedule",
    },
    {
      title: "Time Until Full",
      value: "≈ 26 hours",
      icon: <Trash2 className="h-5 w-5 text-eco-500" />,
      description: "At current fill rate",
    },
    {
      title: "Last Collection",
      value: "Yesterday",
      icon: <Trash2 className="h-5 w-5 text-eco-500" />,
      description: "Apr 22, 2025",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {statistics.map((stat, index) => (
        <Card key={index} className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {stat.icon}
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
