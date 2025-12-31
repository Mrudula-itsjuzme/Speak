'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mic, User, LogOut, LayoutDashboard, Languages, Users } from 'lucide-react';
import { getLoggedInUser, logout, getUser } from '@/lib/memory/sessionStore';

export default function Header() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const email = getLoggedInUser();
            if (email) {
                const userData = await getUser(email);
                setUser(userData);
            } else {
                setUser(null);
            }
        };

        checkUser();
        // Listen for storage changes (for login/logout in other tabs)
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        router.push('/login');
        // Force a re-render in other components
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Mic className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold text-dark-900 dark:text-white">MisSpoke</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link href="/languages" className="text-sm font-medium text-gray-500 hover:text-dark-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-1.5">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/community" className="text-sm font-medium text-gray-500 hover:text-dark-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> Community
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="hidden sm:inline text-sm font-medium text-dark-700 dark:text-gray-300">
                                Hi, {user.name.split(' ')[0]}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                    title="Log Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                                <Link
                                    href="/profile"
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 border-2 border-white dark:border-dark-800 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                                >
                                    <User className="w-5 h-5 text-white" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-dark-900 dark:hover:text-white px-4 py-2">
                                Log In
                            </Link>
                            <Link href="/signup" className="btn-primary text-sm px-5 py-2">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
