'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, User, LogIn } from 'lucide-react';
import { FormData } from '@/types/types';
import useSWRMutation from 'swr/mutation';
import { useUserStore } from "@/store/userStore";

// Get cookie function
function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

// Login fetcher function for SWR
async function loginUser(url: string, { arg }: { arg: FormData }) {
    // Get CSRF token from cookie
    const csrfToken = getCookie('csrftoken');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(arg),
    });

    const responseText = await response.text();
    let data;

    try {
        data = JSON.parse(responseText);
    } catch (e) {
        throw new Error('Invalid server response');
    }

    if (!response.ok) {
        throw new Error(data.error || `Login failed (${response.status})`);
    }

    return data;
}

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // Use SWR mutation for login
    const { trigger, error, isMutating, data } = useSWRMutation('/auth/login/', loginUser);

    // Check for registration success message
    useEffect(() => {
        const registered = searchParams?.get('registered');
        if (registered === 'true') {
            setRegistrationSuccess(true);
        }
    }, [searchParams]);

    // Handle successful login
    useEffect(() => {
        if (data && data.user) {
            useUserStore.getState().setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        }
    }, [data, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await trigger(formData);
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted px-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">ログイン</CardTitle>
                </CardHeader>
                <CardContent>
                    {registrationSuccess && (
                        <Alert className="mb-4 bg-green-50 border-green-300">
                            <AlertTitle className="text-green-700">登録完了</AlertTitle>
                            <AlertDescription className="text-green-600">
                                登録が完了しました。ログインしてください。
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>エラー</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="bg-white"
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">パスワード</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2"
                            disabled={isMutating}
                        >
                            {isMutating ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    ログイン
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-4">
                        <Link href="/forgot-password" className="block">
                            <Button variant="link" className="text-sm text-primary p-0 cursor-pointer">
                                パスワードをお忘れですか？
                            </Button>
                        </Link>

                        <div className="pt-2 border-t">
                            <p className="text-sm mb-2">
                                アカウントをお持ちでないですか？
                            </p>
                            <Link href="/register" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    新規登録
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;