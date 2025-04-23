
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/Header";
import { BinLevelCard } from "@/components/dashboard/BinLevelCard";
import { BinAnalytics } from "@/components/dashboard/BinAnalytics";
import { BinStatistics } from "@/components/dashboard/BinStatistics";
import { IoTConnect } from "@/components/dashboard/IoTConnect";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [binLevel, setBinLevel] = useState(60);
  
  // Set document title
  useEffect(() => {
    document.title = "Smart Bin Monitoring System";
  }, []);

  // Handle IoT device connection status change
  const handleStatusChange = (connected: boolean) => {
    setIsConnected(connected);
    if (!connected) {
      // Reset bin level when disconnected
      setBinLevel(60);
    }
  };

  // Handle bin level changes from the sensor
  const handleLevelChange = (newLevel: number) => {
    setBinLevel(Math.round(newLevel));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-6 px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">Smart Bin Monitoring Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BinLevelCard binLevel={binLevel} />
              <BinStatistics />
            </div>
            <BinAnalytics />
          </div>
          
          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            <IoTConnect 
              onStatusChange={handleStatusChange}
              onLevelChange={handleLevelChange}
            />
            
            <div className="bg-eco-100 border border-eco-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">Connection Status</h3>
              <p className="text-sm mb-4">
                {isConnected 
                  ? "Your IoT device is connected and sending real-time data."
                  : "Connect your IoT device to see real-time bin level data."}
              </p>
              <div className="text-xs text-muted-foreground">
                <p>Note: This is a simulation environment. In a real deployment, the ultrasonic sensor would be physically connected to your ESP8266/Arduino and sending actual measurements.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-4 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Smart Bin Monitoring System
            </p>
            <p className="text-sm text-muted-foreground">
              College Mini Project | Waste Management System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
