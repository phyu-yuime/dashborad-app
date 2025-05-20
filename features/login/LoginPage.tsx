'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';
import { FormData } from '@/types/types';


// Cookieから値を取得する関数
function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. CSRFトークンをCookieにセット
            // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/csrf/`, {
            //     credentials: 'include',
            // });

            // 2. Cookieから取得
            const csrfToken = getCookie('csrftoken');

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };
            if (csrfToken) {
                headers['X-CSRFToken'] = csrfToken;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Invalid server response');
                data = { error: 'Invalid server response' };
            }

            if (!response.ok) {
                throw new Error(data.error || `Login failed (${response.status})`);
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <Card className="w-full max-w-md p-6">
                <CardContent>
                    <h1 className="text-2xl font-semibold text-center mb-4 text-black-500 ">ログイン</h1>

                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>エラー</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className='mb-[0.75rem]'>メールアドレス</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className='mb-[0.75rem]'>パスワード</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'ログイン'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <Link href="/forgot-password">
                            <Button variant="link" className="text-sm text-red-600 p-0 cursor-pointer">
                                パスワードをお忘れですか？
                            </Button>
                        </Link>
                        <div className="flex items-center justify-center mt-4 space-x-2">
                            <p className="text-sm ">
                                アカウントをお持ちでないですか？
                            </p>
                            <Link href="/register">
                                <Button variant="outline" className="p-0 text-blue-600 bg-gray-100 cursor-pointer"> <User />新規登録</Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;