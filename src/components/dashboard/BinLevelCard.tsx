
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface BinLevelCardProps {
  binLevel: number;
}

export function BinLevelCard({ binLevel }: BinLevelCardProps) {
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    if (binLevel >= 80 && !showAlert) {
      setShowAlert(true);
      toast({
        title: "Bin Alert",
        description: "Bin level has exceeded 80% capacity!",
        variant: "destructive",
      });
    } else if (binLevel < 80) {
      setShowAlert(false);
    }
  }, [binLevel, showAlert]);

  const getStatusColor = (level: number) => {
    if (level < 50) return "bg-eco-500";
    if (level < 80) return "bg-warning-500";
    return "bg-alert-500";
  };

  const getStatusText = (level: number) => {
    if (level < 50) return "Normal";
    if (level < 80) return "Medium";
    return "Critical";
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between">
          <span>Bin Fill Level</span>
          {showAlert && (
            <span className="flex items-center gap-2 text-alert-500">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">Critical Level</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Level</span>
            <span className="font-medium">{binLevel}%</span>
          </div>
          <div className="h-40 w-full bg-muted/50 rounded-lg border relative overflow-hidden">
            <div
              className={`absolute bottom-0 w-full transition-all duration-700 ${getStatusColor(binLevel)}`}
              style={{ height: `${binLevel}%` }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 bg-gradient-to-t from-black/10 to-transparent">
              <div className="w-full border-b border-dashed border-foreground/20 mb-1 pb-1 text-xs">
                80% Alert Level
              </div>
              <div className="w-full border-dashed border-foreground/20 mb-20 pb-1 text-xs">
                50% Warning Level
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className={`rounded-full h-3 w-3 mr-2 ${getStatusColor(binLevel)}`} />
            <span>Status: {getStatusText(binLevel)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
