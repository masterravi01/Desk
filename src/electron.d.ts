export interface ElectronAPI {
    send: (channel: string, data?: any) => void;
    receive: (channel: string, callback: (data: any) => void) => void;
    invoke: (channel: string, data?: any) => Promise<any>;
}

// Extend the Window object with the Electron API
declare global {
    interface Window {
        electron: ElectronAPI;
    }
}
