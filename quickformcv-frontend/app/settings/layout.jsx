import { Navbar } from "@/components/shared/navbar";

export default function SettingsLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#fbfbfb]">
            <Navbar />
            {children}
        </div>
    );
}