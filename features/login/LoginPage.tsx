'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';
import { FormData } from '@/types/types';

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [csrfToken, setCsrfToken] = useState<string>('');

    // Fetch CSRF token on mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/auth/', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.csrf_token) {
                        setCsrfToken(data.csrf_token);
                        console.log('CSRF token obtained');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
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
