'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import useSWRMutation from 'swr/mutation';

// Create a fetcher function for SWR mutation
type RegisterFormData = {
    username: string;
    email: string;
    password: string;
    password2: string;
};

async function registerUser(url: string, { arg }: { arg: RegisterFormData }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || Object.values(errorData)[0] || 'Registration failed');
    }

    return response.json();
}

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });

    // Use SWR mutation hook
    const { trigger, error, isMutating } = useSWRMutation('/auth/register/', registerUser);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Trigger the mutation with form data
            await trigger(formData);
            router.push('/login?registered=true');
        } catch (err) {
            // Error handling is automatically managed by SWR
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Create an Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password2">Confirm Password</Label>
                            <Input
                                id="password2"
                                name="password2"
                                type="password"
                                value={formData.password2}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <Button type="submit" disabled={isMutating}>
                                {isMutating ? 'Registering...' : 'Register'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex items-center gap-2 self-start text-sm"
                                type="button"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}