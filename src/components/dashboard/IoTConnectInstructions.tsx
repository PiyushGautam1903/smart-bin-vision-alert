
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function IoTConnectInstructions() {
  return (
    <AccordionItem value="connection-instructions">
      <AccordionTrigger>Connection Instructions</AccordionTrigger>
      <AccordionContent>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Connect the HC-SR04 ultrasonic sensor to your ESP8266</li>
          <li>Upload the Arduino code (shown in the code reference)</li>
          <li>Make sure to replace WiFi credentials and server URL</li>
          <li>Position the ultrasonic sensor at the top of the bin</li>
          <li>Power on the ESP8266</li>
          <li>Click "Connect" button to start receiving data</li>
        </ol>
      </AccordionContent>
    </AccordionItem>
  );
}
