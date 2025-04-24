
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { ARDUINO_CONFIG } from "@/config/arduino-config";

interface UseIoTConnectionProps {
  onStatusChange: (isConnected: boolean) => void;
  onLevelChange: (level: number) => void;
}

export function useIoTConnection({ onStatusChange, onLevelChange }: UseIoTConnectionProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const connectToDevice = async () => {
    try {
      // Web Serial API for direct USB connection
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: ARDUINO_CONFIG.SERIAL.BAUD_RATE });
      
      setIsConnected(true);
      setConnecting(false);
      onStatusChange(true);

      toast({
        title: "Arduino Connected",
        description: "Successfully connected via USB serial",
      });

      // Start reading data
      const reader = port.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const data = new TextDecoder().decode(value);
        const match = data.match(/LEVEL:(\d+)/);
        if (match) {
          const binLevel = parseInt(match[1], 10);
          onLevelChange(binLevel);
        }
      }
    } catch (error) {
      console.error('Serial connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Arduino",
        variant: "destructive"
      });
      setIsConnected(false);
      onStatusChange(false);
    }
  };

  const disconnectDevice = () => {
    setIsConnected(false);
    onStatusChange(false);
    toast({
      title: "Arduino Disconnected",
      description: "USB serial connection terminated"
    });
  };

  return {
    isConnected,
    connecting,
    connectToDevice,
    disconnectDevice
  };
}
