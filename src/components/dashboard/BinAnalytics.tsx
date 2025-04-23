
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";

interface BinData {
  time: string;
  level: number;
}

export function BinAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<BinData[]>([]);

  // Simulate data fetching and real-time updates
  useEffect(() => {
    // Initial data
    const initialData: BinData[] = Array.from({ length: 12 }, (_, i) => {
      const hour = i + 8; // Start from 8 AM
      return {
        time: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? "PM" : "AM"}`,
        level: Math.floor(Math.random() * 40) + 20,
      };
    });
    setAnalyticsData(initialData);

    // Simulate updates every minute
    const interval = setInterval(() => {
      setAnalyticsData((prevData) => {
        const newData = [...prevData];
        
        // Update the most recent data point
        const lastIndex = newData.length - 1;
        const newLevel = Math.min(100, Math.max(0, newData[lastIndex].level + (Math.random() > 0.5 ? 5 : -2)));
        
        newData[lastIndex] = {
          ...newData[lastIndex],
          level: newLevel,
        };
        return newData;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Daily Fill Level Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4aac4a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4aac4a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} tickCount={6} />
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                  borderRadius: '0.5rem',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="level" 
                stroke="#4aac4a" 
                fillOpacity={1} 
                fill="url(#colorLevel)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
