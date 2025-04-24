
import { AccordionContent } from "@/components/ui/accordion";

interface ArduinoCodeDisplayProps {
  code: string;
}

export function ArduinoCodeDisplay({ code }: ArduinoCodeDisplayProps) {
  return (
    <AccordionContent>
      <div className="bg-slate-800 text-slate-100 p-3 rounded-md text-xs overflow-auto max-h-60">
        <pre>{code}</pre>
      </div>
    </AccordionContent>
  );
}
