
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface UseIoTConnectionProps {
  onStatusChange: (isConnected: boolean) => void;
  onLevelChange: (level: number) => void;
}

export function useIoTConnection({ onStatusChange, onLevelChange }: UseIoTConnectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [internalLevel, setInternalLevel] = useState(60);

  const connectToDevice = () => {
    setConnecting(true);
    
    const ws = new WebSocket('ws://your-esp8266-ip:81');
    
    ws.onopen = () => {
      setIsConnected(true);
      setConnecting(false);
      setWsConnection(ws);
      onStatusChange(true);
      toast({
        title: "IoT Device Connected",
        description: "Successfully connected to ultrasonic sensor.",
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.binLevel !== undefined) {
          const newLevel = Math.min(100, Math.max(0, Number(data.binLevel)));
          setInternalLevel(newLevel);
          onLevelChange(newLevel);
        }
      } catch (error) {
        console.error('Error parsing sensor data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the sensor. Please check your device.",
        variant: "destructive",
      });
      disconnectDevice();
    };
  };

  const disconnectDevice = () => {
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
    }
    setIsConnected(false);
    onStatusChange(false);
    toast({
      title: "IoT Device Disconnected",
      description: "Connection to ultrasonic sensor terminated.",
    });
  };

  useEffect(() => {
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  return {
    isConnected,
    connecting,
    internalLevel,
    connectToDevice,
    disconnectDevice
  };
}
