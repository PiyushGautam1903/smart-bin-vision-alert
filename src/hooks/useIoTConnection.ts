
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { ARDUINO_CONFIG } from "@/config/arduino-config";

interface UseIoTConnectionProps {
    onStatusChange: (isConnected: boolean) => void;
    onLevelChange: (level: number) => void;
}

export function useIoTConnection({ onStatusChange, onLevelChange }: UseIoTConnectionProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const portRef = useRef<SerialPort | null>(null);
    const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
    const isReadingRef = useRef<boolean>(false);
    
    const startReading = async (port: SerialPort) => {
        readerRef.current = port.readable.getReader();
        isReadingRef.current = true;
        try {
            while (isReadingRef.current) {
                const { value, done } = await readerRef.current.read();
                if (done) break;

                const data = new TextDecoder().decode(value);
                const match = data.match(/LEVEL:(\d+)/);
                if (match) {
                    const binLevel = parseInt(match[1], 10);
                    onLevelChange(binLevel);
                }
            }
        } catch (error) {
            if (isReadingRef.current){
                console.error("Serial read error:", error);
                toast({
                    title: "Serial Read Error",
                    description: "An error occurred while reading data from the serial port.",
                    variant: "destructive",
                });
            }
        } finally {
            isReadingRef.current = false;
            readerRef.current?.releaseLock();
            readerRef.current = null;
        }
    };

    const connectToDevice = async () => {
        setConnecting(true);
        try {
            // Check if the Web Serial API is supported by the browser
            if (!("serial" in navigator)) {
                toast({
                    title: "Web Serial API Not Supported",description: "Your browser does not support the Web Serial API. Please use a supported browser.",
                   variant: "destructive",
                });
                setConnecting(false);
                return;
            }

            if(readerRef.current){
              await readerRef.current.cancel()
              readerRef.current = null
            }
            // Request and open the serial port
            portRef.current = await navigator.serial.requestPort();
            await portRef.current.open({ baudRate: ARDUINO_CONFIG.SERIAL.BAUD_RATE });

            setIsConnected(true);
            setConnecting(false);
            onStatusChange(true);

            toast({
                title: "Arduino Connected",description: "Successfully connected via USB serial",
            });

            startReading(portRef.current);
        } catch (error) {
            if(error instanceof DOMException && error.name === "NotFoundError"){
                toast({
                  title: "Connection Error",
                  description: "No serial port selected.",
                  variant: "destructive",
                });
            }else{
                console.error("Serial connection error:", error);
                toast({
                    title: "Connection Failed",
                    description: "Could not connect to Arduino",
                    variant: "destructive",
                });
            }
            setIsConnected(false);
            onStatusChange(false);
        } finally {
            setConnecting(false);
        }
    };
    
    const disconnectDevice = async () => {
        isReadingRef.current = false;
        if (readerRef.current) {
            await readerRef.current.cancel();
            readerRef.current = null;
        }
        if (portRef.current && portRef.current.writable) {
            await portRef.current.close();
        }
        portRef.current = null;
        setIsConnected(false);
        onStatusChange(false);
        toast({
            title: "Arduino Disconnected",
            description: "USB serial connection terminated",
        });
    };

    useEffect(() => {
        return () => {
            disconnectDevice();
        };
    }, []);

    return {
        isConnected,
        connecting,
        connectToDevice,
        disconnectDevice,
    };
}

