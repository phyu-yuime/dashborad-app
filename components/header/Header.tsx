import { Button } from "@/components/ui/button";
import { useHeaderStore } from "@/store/userHeaderStore";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

export default function Header() {
    const isLoggedIn = useHeaderStore((state) => state.isLoggedIn);
    const setLoggedIn = useHeaderStore((state) => state.setisLoggedIn);
    const router = useRouter();

    const handleLogin = () => {
        router.push("/login");
    };

    const handleSignUp = () => {
        router.push("/register");
    };

    return (
        <header
            className="w-full flex items-center justify-between px-8 py-4 shadow-lg"
            style={{
                background: "linear-gradient(120deg, #4f8cfb 0%, #235390 50%, #a770ef 100%)",
                boxShadow: "0 4px 24px 0 rgba(80, 143, 245, 0.15)",
            }}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md">
                    <span className="text-3xl font-extrabold text-blue-600">M</span>
                </div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow" style={{ marginBottom: "0px", color: "#ffffff" }}>
                    Memo App
                </h1>
            </div>

            {!isLoggedIn && (
                <div className="flex gap-4">
                    <Button
                        onClick={handleLogin}
                        className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2 rounded-xl shadow hover:bg-blue-50 transition cursor-pointer"
                    >
                        <LogIn className="w-5 h-5" />
                        ログイン
                    </Button>
                    <Button
                        onClick={handleSignUp}
                        className="flex items-center gap-2 bg-yellow-50 text-yellow-800 font-semibold px-6 py-2 rounded-xl shadow hover:bg-yellow-100 transition cursor-pointer"
                    >
                        <UserPlus className="w-5 h-5" />
                        新規登録
                    </Button>
                </div>
            )}
        </header>
    );
}
