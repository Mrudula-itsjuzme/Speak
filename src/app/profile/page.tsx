'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Trophy, Flame, Clock, Languages, ChevronRight,
    Shield, Bell, HelpCircle, Save, Check, Mail, Settings, Calendar, User, LogOut
} from 'lucide-react';
import { getUser, getLoggedInUser, logout, getAllSessions, getUserProfile, updateUser } from '@/lib/memory/sessionStore';
import Header from '@/components/Header';

const LANGUAGES = [
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { id: 'french', name: 'French', flag: '🇫🇷' },
    { id: 'italian', name: 'Italian', flag: '🇮🇹' },
    { id: 'japanese', name: 'Japanese', flag: '🇯🇵' },
    { id: 'korean', name: 'Korean', flag: '🇰🇷' },
];

export default function ProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Settings state
    const [nativeLang, setNativeLang] = useState('');
    const [learningLang, setLearningLang] = useState('');

    const router = useRouter();

    useEffect(() => {
        const loadProfileData = async () => {
            const email = getLoggedInUser();
            if (!email) {
                router.push('/login');
                return;
            }

            const user = await getUser(email);
            const profile = await getUserProfile();
            const allSessions = await getAllSessions();

            setUserData(user);
            setNativeLang(user?.nativeLanguage || localStorage.getItem('nativeLanguage') || 'english');
            setLearningLang(user?.learningLanguage || 'spanish');
            setStats(profile);
            setSessions(allSessions.reverse().slice(0, 5)); // Latest 5
        };

        loadProfileData();
    }, [router]);

    const handleSettingsSave = async () => {
        setIsSaving(true);
        try {
            const email = getLoggedInUser();
            if (email) {
                await updateUser(email, {
                    nativeLanguage: nativeLang,
                    learningLanguage: learningLang
                });
                localStorage.setItem('nativeLanguage', nativeLang);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-dark-900 text-white">
            <Header />

            <main className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-8 rounded-3xl border border-white/10 text-center"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold shadow-glow-md">
                                {userData.name.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
                            <p className="text-gray-400 text-sm mb-6 flex items-center justify-center gap-1.5">
                                <Mail className="w-4 h-4" /> {userData.email}
                            </p>
                            <button className="w-full py-3 rounded-xl bg-dark-800 border border-white/5 hover:bg-dark-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                                <Settings className="w-4 h-4" /> Edit Profile
                            </button>
                        </motion.div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass p-4 rounded-2xl border border-white/10">
                                <Flame className="w-6 h-6 text-orange-500 mb-2" />
                                <p className="text-2xl font-bold">{stats?.streakDays || 0}</p>
                                <p className="text-xs text-gray-400">Day Streak</p>
                            </div>
                            <div className="glass p-4 rounded-2xl border border-white/10">
                                <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
                                <p className="text-2xl font-bold">{stats?.totalSessions || 0}</p>
                                <p className="text-xs text-gray-400">Lessons</p>
                            </div>
                        </div>

                        {/* Preference Settings */}
                        <div className="glass p-6 rounded-2xl border border-white/10">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-primary-400" /> Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Native Language</label>
                                    <select
                                        value={nativeLang}
                                        onChange={(e) => setNativeLang(e.target.value)}
                                        className="w-full bg-dark-800 border-none rounded-xl text-sm py-2 px-3 focus:ring-2 focus:ring-primary-500 transition-all border-white/5"
                                    >
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.id} value={lang.id}>{lang.flag} {lang.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Learning Language</label>
                                    <select
                                        value={learningLang}
                                        onChange={(e) => setLearningLang(e.target.value)}
                                        className="w-full bg-dark-800 border-none rounded-xl text-sm py-2 px-3 focus:ring-2 focus:ring-primary-500 transition-all border-white/5"
                                    >
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.id} value={lang.id}>{lang.flag} {lang.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleSettingsSave}
                                    disabled={isSaving}
                                    className={`w-full mt-2 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${saveSuccess
                                        ? 'bg-green-500 text-white'
                                        : 'bg-primary-500 hover:bg-primary-600 text-white shadow-glow-sm'
                                        }`}
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : saveSuccess ? (
                                        <><Check className="w-4 h-4" /> Saved!</>
                                    ) : (
                                        <><Save className="w-4 h-4" /> Save Changes</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity & History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Learning Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-primary-900/10 to-transparent"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Clock className="w-6 h-6 text-primary-400" /> Recent Activity
                                    </h3>
                                    <p className="text-gray-400 text-sm">Your learning journey this week</p>
                                </div>
                                <Link href="/languages" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {sessions.length > 0 ? (
                                <div className="space-y-4">
                                    {sessions.map((session, i) => (
                                        <div key={session.id} className="flex items-center gap-4 p-4 rounded-2xl bg-dark-800/50 border border-white/5 hover:border-primary-500/20 transition-all group">
                                            <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                {session.language === 'spanish' && '🇪🇸'}
                                                {session.language === 'french' && '🇫🇷'}
                                                {session.language === 'japanese' && '🇯🇵'}
                                                {session.language === 'italian' && '🇮🇹'}
                                                {session.language === 'korean' && '🇰🇷'}
                                                {!['spanish', 'french', 'japanese', 'italian', 'korean'].includes(session.language) && '🌐'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <h4 className="font-bold capitalize">{session.language} Practice</h4>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(session.startTime).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400 line-clamp-1">{session.summary || 'Completed conversation'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No learning sessions yet. Time to start practicing!</p>
                                    <Link href="/languages" className="btn-primary inline-flex mt-6 px-6 py-3 rounded-xl">
                                        Browse Courses
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        {/* Menu Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="flex items-center justify-between p-5 rounded-2xl bg-dark-800 hover:bg-dark-700 transition-colors border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Security</p>
                                        <p className="text-xs text-gray-500">Privacy & auth settings</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </button>

                            <button className="flex items-center justify-between p-5 rounded-2xl bg-dark-800 hover:bg-dark-700 transition-colors border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Notifications</p>
                                        <p className="text-xs text-gray-500">Manage alerts</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </button>

                            <button className="flex items-center justify-between p-5 rounded-2xl bg-dark-800 hover:bg-dark-700 transition-colors border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">History</p>
                                        <p className="text-xs text-gray-500">View all records</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </button>

                            <button className="flex items-center justify-between p-5 rounded-2xl bg-dark-800 hover:bg-dark-700 transition-colors border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Support</p>
                                        <p className="text-xs text-gray-500">Contact our team</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
