
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border shadow-sm bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full eco-gradient flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M4 19h17"/>
                <path d="M4 15h17"/>
                <path d="M4 11h17"/>
                <path d="M4 7h17"/>
              </svg>
            </div>
            <span className="font-semibold text-xl">EcoSmart Bin</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-alert-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}
