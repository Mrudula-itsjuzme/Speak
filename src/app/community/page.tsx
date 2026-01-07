'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, MessageCircle, Heart, Globe, MessageSquare, Award } from 'lucide-react';
import Header from '@/components/Header';

const TOP_LEARNERS = [
    { name: 'Yuki Sato', language: 'Italian', xp: 12450, streak: 45, level: 'Gold' },
    { name: 'Elena Rossi', language: 'Japanese', xp: 11200, streak: 32, level: 'Gold' },
    { name: 'Alex Thompson', language: 'Spanish', xp: 9800, streak: 124, level: 'Silver' },
    { name: 'Maria Garcia', language: 'French', xp: 8500, streak: 15, level: 'Bronze' },
];

const GLOBAL_FEED = [
    {
        id: 1,
        user: 'Yuki Sato',
        type: 'achievement',
        content: 'Just completed "Ordering at a Restaurant" in Italian! 🇮🇹',
        timestamp: '2m ago',
        likes: 24,
        comments: 5
    },
    {
        id: 2,
        user: 'Alex Thompson',
        type: 'milestone',
        content: 'Hit a 124-day streak! Consistency is key. 🚀',
        timestamp: '15m ago',
        likes: 156,
        comments: 12
    },
    {
        id: 3,
        user: 'Elena Rossi',
        type: 'help',
        content: 'Can someone explain the difference between は and が in Japanese? 🇯🇵',
        timestamp: '1h ago',
        likes: 8,
        comments: 24
    },
];

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-dark-900 dark">
            <Header />

            <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Feed */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
                                <Users className="w-8 h-8 text-primary-500" /> Community Feed
                            </h1>
                            <button className="btn-primary flex items-center gap-2 py-2 text-sm">
                                <MessageSquare className="w-4 h-4" /> New Post
                            </button>
                        </div>

                        {/* Simulated Post Input */}
                        <div className="glass p-4 rounded-2xl border border-gray-100 dark:border-white/10">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Share your learning progress..."
                                    className="flex-1 bg-gray-50 dark:bg-dark-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        {/* Feed items */}
                        <div className="space-y-6">
                            {GLOBAL_FEED.map((post) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass p-6 rounded-2xl border border-gray-100 dark:border-white/10 card-hover"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-dark-200 dark:bg-dark-800 flex items-center justify-center font-bold">
                                                {post.user.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-dark-900 dark:text-white">{post.user}</h3>
                                                <p className="text-xs text-gray-500">{post.timestamp}</p>
                                            </div>
                                        </div>
                                        {post.type === 'achievement' && (
                                            <span className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-bold uppercase px-2 py-1 rounded-full">
                                                Achievement
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-dark-700 dark:text-gray-300 mb-6">{post.content}</p>

                                    <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-white/5">
                                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 transition-colors">
                                            <Heart className="w-4 h-4" /> {post.likes}
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 transition-colors">
                                            <MessageCircle className="w-4 h-4" /> {post.comments}
                                        </button>
                                        <button className="ml-auto text-sm text-gray-400 hover:text-dark-900 dark:hover:text-white transition-colors">
                                            Share
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Leaderboard & Stats */}
                    <div className="w-full lg:w-80 space-y-8">
                        <div className="glass p-6 rounded-3xl border border-gray-100 dark:border-white/10">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Award className="w-6 h-6 text-yellow-500" /> Top Learners
                            </h2>
                            <div className="space-y-4">
                                {TOP_LEARNERS.map((learner, index) => (
                                    <div key={learner.name} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-dark-800 flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{learner.name}</p>
                                            <p className="text-xs text-gray-500">{learner.language}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-primary-500">{learner.xp} XP</p>
                                            <p className="text-[10px] text-gray-400">{learner.streak}d 🔥</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 rounded-xl bg-gray-50 dark:bg-dark-800 text-sm font-medium hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                                View Full Leaderboard
                            </button>
                        </div>

                        <div className="glass p-6 rounded-3xl border border-gray-100 dark:border-white/10 bg-gradient-to-br from-primary-500/10 to-transparent">
                            <h2 className="font-bold mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-500" /> Language Clubs
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { name: 'Tokyo Explorers', members: 1240, flag: '🇯🇵' },
                                    { name: 'Italian Espresso', members: 856, flag: '🇮🇹' },
                                    { name: 'Parisian Bistro', members: 2100, flag: '🇫🇷' },
                                ].map(club => (
                                    <button key={club.name} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-dark-800 transition-all text-left">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{club.flag}</span>
                                            <div>
                                                <p className="text-sm font-bold">{club.name}</p>
                                                <p className="text-[10px] text-gray-500">{club.members} members</p>
                                            </div>
                                        </div>
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
