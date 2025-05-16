'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, X, User } from 'lucide-react';
import { Memo } from '@/types/types';


export default function DashboardPage() {
    const [memos, setMemos] = useState<Memo[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user info when component mounts
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    fetchMemos();
                } else {
                    console.error('Authentication failed');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const fetchMemos = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memos/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setMemos(data);
            } else {
                console.error('Failed to fetch memos:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching memos:', error);
        }
    }

    const handleCreate = async () => {
        if (!newTitle || !newContent) return;

        const csrfToken = getCookie('csrftoken'); // Get token from cookie

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (csrfToken) {
                headers['X-CSRFToken'] = csrfToken;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memos/`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    title: newTitle,
                    content: newContent,
                }),
            });

            if (response.ok) {
                const newMemo = await response.json();
                setMemos([...memos, newMemo]);
                resetForm();
            } else {
                console.error('Failed to create memo:', await response.text());
                alert('Failed to create memo. Please try again.');
            }
        } catch (error) {
            console.error('Error creating memo:', error);
            alert('An error occurred while creating the memo.');
        }
    };

    function getCookie(name: string | any[]) {
        let cookieValue = null;
        if (typeof document !== 'undefined' && document.cookie) {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    const handleEdit = (id: number) => {
        const memo = memos.find((m) => m.id === id);
        if (memo) {
            setNewTitle(memo.title);
            setNewContent(memo.content);
            setEditingId(id);
            setIsDrawerOpen(true);
        }
    };

    const handleUpdate = async () => {
        if (!editingId) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memos/${editingId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: newTitle,
                    content: newContent,
                }),
            });

            if (response.ok) {
                const updatedMemo = await response.json();
                setMemos((prev) =>
                    prev.map((memo) => (memo.id === editingId ? updatedMemo : memo))
                );
                resetForm();
            } else {
                console.error('Failed to update memo:', await response.text());
                alert('Failed to update memo. Please try again.');
            }
        } catch (error) {
            console.error('Error updating memo:', error);
            alert('An error occurred while updating the memo.');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memos/${id}/`, {
                method: 'DELETE',
                credentials: 'include', // Important for sending cookies/authentication
            });

            if (response.ok) {
                setMemos(memos.filter((memo) => memo.id !== id));
            } else {
                console.error('Failed to delete memo:', await response.text());
                alert('Failed to delete memo. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting memo:', error);
            alert('An error occurred while deleting the memo.');
        }
    };

    const resetForm = () => {
        setNewTitle('');
        setNewContent('');
        setEditingId(null);
        setIsDrawerOpen(false);
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-64 border-r p-4 hidden md:block">
                <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

                {/* User info section */}
                <div className="mb-6 py-2 border-b">
                    <div className="flex items-center gap-2 mb-2">
                        <User size={18} />
                        {loading ? (
                            <span className="text-sm text-muted-foreground">Loading...</span>
                        ) : user ? (
                            <span className="font-medium">Welcome, {user.username}</span>
                        ) : (
                            <span className="text-sm text-muted-foreground">Not logged in</span>
                        )}
                    </div>
                </div>

                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button variant="default" className="w-full flex items-center gap-2">
                            <Plus size={18} />
                            メーモを作成
                        </Button>
                    </DrawerTrigger>
                </Drawer>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
                <div className="mb-4">
                    {/* User info for mobile view */}
                    <div className="md:hidden flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            {loading ? (
                                <span className="text-sm text-muted-foreground">Loading...</span>
                            ) : user ? (
                                <span className="font-medium">Welcome, {user.username}</span>
                            ) : (
                                <span className="text-sm text-muted-foreground">Not logged in</span>
                            )}
                        </div>
                    </div>

                    {/* Show drawer trigger on mobile */}
                    <div className="md:hidden">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerTrigger asChild>
                                <Button variant="default" className="flex items-center gap-2">
                                    <Plus size={18} />
                                    メーモを作成
                                </Button>
                            </DrawerTrigger>
                        </Drawer>
                    </div>
                </div>

                {/* Memo list */}
                {memos && memos.length > 0 ? (
                    memos.map((memo) => (
                        <Card key={memo.id} className="mb-4">
                            <CardHeader>
                                <CardTitle>{memo.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{memo.content}</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => handleEdit(memo.id)}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(memo.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground">No memos found.</p>
                )}

            </div>

            {/* Drawer Content */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{editingId ? '改修メーモ' : 'メーモ'}</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 space-y-4">
                        <div>
                            <Label htmlFor="title" className='mb-[0.75rem]'>タイトル</Label>
                            <Input
                                className='bg-gray-200 border-black-500'
                                id="title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="メーモのタイトル"
                            />
                        </div>
                        <div>
                            <Label htmlFor="content" className='mb-[0.75rem]'>内容</Label>
                            <Textarea className='bg-gray-200 border-black-500'
                                id="content"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="メーモの内容"
                                rows={4}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={editingId ? handleUpdate : handleCreate} className="flex-1">
                                {editingId ? '更新' : '作成'}
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline" className="flex-1" onClick={resetForm}>
                                    キャンセル
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}


