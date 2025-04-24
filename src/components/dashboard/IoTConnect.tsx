
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { useIoTConnection } from "@/hooks/useIoTConnection";
import { IoTConnectionInfo } from "./IoTConnectionInfo";
import { IoTArduinoCode } from "./IoTArduinoCode";
import { IoTConnectInstructions } from "./IoTConnectInstructions";

interface IoTConnectProps {
  onStatusChange: (isConnected: boolean) => void;
  onLevelChange: (level: number) => void;
}

export function IoTConnect({ onStatusChange, onLevelChange }: IoTConnectProps) {
  const { isConnected, connecting, connectToDevice, disconnectDevice } = useIoTConnection({
    onStatusChange,
    onLevelChange,
  });

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>IoT Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className={`block rounded-full h-3 w-3 ${isConnected ? "bg-eco-500" : "bg-muted-foreground"}`} />
              <span>Ultrasonic Sensor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Connected and sending data" : "Not connected"}
            </p>
          </div>
          <Button 
            onClick={isConnected ? disconnectDevice : connectToDevice}
            disabled={connecting}
            variant={isConnected ? "outline" : "default"}
          >
            {connecting ? "Connecting..." : isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
        
        <Accordion type="single" collapsible>
          <IoTConnectionInfo />
          <IoTArduinoCode />
          <IoTConnectInstructions />
        </Accordion>
      </CardContent>
    </Card>
  );
}
