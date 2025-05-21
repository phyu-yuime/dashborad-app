'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LogOut, Plus, User } from 'lucide-react';
import themeConfig from "@/themes.config";
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
import { Memo } from '@/types/types';

// SWR fetcher
const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then(res => res.json());

// Cookie取得関数
function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export default function DashboardPage() {
    // SWRでユーザー情報取得
    const { data: user, isLoading: userLoading, mutate: mutateUser } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/userinfo/`,
        fetcher
    );

    // SWRでメモ一覧取得
    const { data: memos, isLoading: memosLoading, mutate: mutateMemos } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/memos/`,
        fetcher
    );

    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // メモ作成
    const handleCreate = async () => {
        if (!newTitle || !newContent) return;
        const csrfToken = getCookie('csrftoken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });
            if (res.ok) {
                await mutateMemos();
                resetForm();
            } else {
                alert('Failed to create memo');
            }
        } catch {
            alert('Error creating memo');
        }
    };

    // メモ編集
    const handleEdit = (id: number) => {
        const memo = memos?.find((m: { id: number; }) => m.id === id);
        if (memo) {
            setNewTitle(memo.title);
            setNewContent(memo.content);
            setEditingId(id);
            setIsDrawerOpen(true);
        }
    };

    // メモ更新
    const handleUpdate = async () => {
        if (!editingId) return;
        const csrfToken = getCookie('csrftoken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memos/${editingId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });
            if (res.ok) {
                await mutateMemos();
                resetForm();
            } else {
                alert('Failed to update memo');
            }
        } catch {
            alert('Error updating memo');
        }
    };

    // メモ削除
    const handleDelete = async (id: React.Key | null | undefined) => {
        if (!confirm('Are you sure you want to delete this memo?')) return;

        const csrfToken = getCookie('csrftoken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memos/${id}/delete/`, {
                method: 'DELETE',
                headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {},
                credentials: 'include',
            });
            if (res.ok) {
                await mutateMemos();
            } else {
                alert('Failed to delete memo');
            }
        } catch {
            alert('Error deleting memo');
        }
    };

    // ログアウト
    const handleLogout = async () => {
        const csrfToken = getCookie('csrftoken');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
                },
                credentials: 'include',
            });
            if (res.ok) {
                mutateUser();
                window.location.href = '/';
            } else {
                alert('ログアウトに失敗しました');
            }
        } catch {
            alert('ログアウト時にエラーが発生しました');
        }
    };

    const resetForm = () => {
        setNewTitle('');
        setNewContent('');
        setEditingId(null);
        setIsDrawerOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white hidden md:block" style={{ boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-8">Memo App</h2>

                    {/* User info section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 p-3 bg-blue-700 rounded-lg">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600">
                                <User size={20} />
                            </div>
                            {userLoading ? (
                                <span className="text-sm opacity-75">Loading...</span>
                            ) : user ? (
                                <div>
                                    <span className="font-medium">{user.username}</span>
                                    <p className="text-xs opacity-75">Welcome back!</p>
                                </div>
                            ) : (
                                <span className="text-sm opacity-75">Not logged in</span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerTrigger asChild>
                                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 flex items-center justify-center gap-2 rounded-lg font-medium transition-all">
                                    <Plus size={18} />
                                    メーモを作成
                                </Button>
                            </DrawerTrigger>
                        </Drawer>

                        <Button
                            variant="ghost"
                            className="w-full justify-start text-white hover:bg-blue-700 hover:text-white flex items-center gap-2"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            ログアウト
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
                {/* Mobile header */}
                <div className="md:hidden flex items-center justify-between mb-6 bg-blue-600 text-white p-4 rounded-lg">
                    <h2 className="text-xl font-bold">Dashboard</h2>
                    <div className="flex gap-2">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-white hover:bg-blue-700">
                                    <Plus size={20} />
                                </Button>
                            </DrawerTrigger>
                        </Drawer>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-blue-700" onClick={handleLogout}>
                            <LogOut size={20} />
                        </Button>
                    </div>
                </div>

                {/* User info for mobile */}
                <div className="md:hidden mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <User size={20} />
                                </div>
                                {userLoading ? (
                                    <span className="text-sm text-gray-500">Loading...</span>
                                ) : user ? (
                                    <div>
                                        <span className="font-medium">{user.username}</span>
                                        <p className="text-xs text-gray-500">Welcome back!</p>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500">Not logged in</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Memo list with enhanced styling */}
                {memosLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : memos && memos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memos.map((memo: { id: React.Key | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; content: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                            <Card key={memo.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                                <CardHeader className="bg-white p-4 border-b">
                                    <CardTitle className="text-lg font-semibold truncate">{memo.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <p className="text-gray-600 whitespace-pre-line line-clamp-3">{memo.content}</p>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                            onClick={() => typeof memo.id === 'number' && handleEdit(memo.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1 hover:bg-red-700"
                                            onClick={() => handleDelete(memo.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border border-dashed border-gray-300 bg-gray-50">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">No memos found.</h3>
                            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                <DrawerTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus size={18} className="mr-2" />
                                        メーモを作成
                                    </Button>
                                </DrawerTrigger>
                            </Drawer>
                        </CardContent>
                    </Card>
                )}
            </div>
            {/* Drawer Content */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent className="shadow-lg">
                    <DrawerHeader className="border-b pb-4">
                        <DrawerTitle className="text-xl font-bold text-center">
                            {editingId ? '改修メーモ' : 'メーモ'}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                        <div>
                            <Label htmlFor="title" className="text-sm font-medium mb-2 block">タイトル</Label>
                            <Input
                                id="title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="メーモのタイトル"
                                className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <Label htmlFor="content" className="text-sm font-medium mb-2 block">内容</Label>
                            <Textarea
                                id="content"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="メーモの内容"
                                rows={6}
                                className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                onClick={editingId ? handleUpdate : handleCreate}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
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
