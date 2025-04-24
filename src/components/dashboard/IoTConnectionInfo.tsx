
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function IoTConnectionInfo() {
  return (
    <>
      <AccordionItem value="connection-info">
        <AccordionTrigger>Connection Information</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Device Type:</span>
              <span>Ultrasonic HC-SR04</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Communication:</span>
              <span>WiFi (ESP8266)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Location:</span>
              <span>Building A, Floor 1</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Data Rate:</span>
              <span>Every 5 seconds</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  );
}
