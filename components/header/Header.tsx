import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHeaderStore } from "@/store/userHeaderStore";
import router from "next/router";
import {
    BookOpen,
    LogIn,
    User,
    Settings,
    LogOut,
    Menu,
    PenTool
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
    const isLoggedIn = useHeaderStore((state) => state.isLoggedIn);
    const setLoggedIn = useHeaderStore((state) => state.setisLoggedIn);

    const handleLogin = () => {
        router.push("/login");
    };

    const handleLogout = () => {
        setLoggedIn(false);
        router.push("/");
    };

    const handleProfile = () => {
        router.push("/profile");
    };

    const handleSettings = () => {
        router.push("/settings");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
                {/* Logo Section */}
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                        <PenTool className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        {/* <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Memo App
                        </h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                            Your digital notebook
                        </p> */}
                    </div>
                </div>

                {/* Navigation & User Section */}
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <div className="flex items-center space-x-3">
                            {/* Quick Stats Badge */}
                            <Badge variant="secondary" className="hidden md:flex items-center space-x-1">
                                <BookOpen className="h-3 w-3" />
                                <span className="text-xs">12 memos</span>
                            </Badge>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-blue-200 transition-all duration-200"
                                    >
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/api/placeholder/32/32" alt="User" />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                                U
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium">John Doe</p>
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                john.doe@example.com
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>プロフィール</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>設定</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>ログアウト</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={handleLogin}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                ログイン
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden"
                        onClick={() => {/* Handle mobile menu */ }}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}