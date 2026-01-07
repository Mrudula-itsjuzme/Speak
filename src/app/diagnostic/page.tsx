'use client';

import { useState } from 'react';
import { useConversation } from '@11labs/react';

export default function DiagnosticPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [agentId, setAgentId] = useState(process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '');

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
        console.log(message);
    };

    const conversation = useConversation({
        onConnect: () => {
            addLog('✅ Connected to ElevenLabs');
        },
        onDisconnect: () => {
            addLog('❌ Disconnected from ElevenLabs');
        },
        onMessage: (message: unknown) => {
            addLog(`📨 Message received: ${JSON.stringify(message)}`);
        },
        onError: (error: unknown) => {
            addLog(`❌ Error: ${JSON.stringify(error)}`);
        },
        onModeChange: (mode: { mode: string }) => {
            addLog(`🔄 Mode changed: ${JSON.stringify(mode)}`);
        }
    });

    const testConnection = async () => {
        try {
            addLog('🔍 Testing microphone access...');
            await navigator.mediaDevices.getUserMedia({ audio: true });
            addLog('✅ Microphone access granted');

            addLog(`🔍 Attempting to connect to agent: ${agentId}`);
            await conversation.startSession({
                agentId: agentId,
                connectionType: 'websocket',
            });
            addLog('✅ Session started');
        } catch (error: unknown) {
            if (error instanceof Error) {
                addLog(`❌ Failed: ${error.message}`);
            } else {
                addLog(`❌ Failed: ${String(error)}`);
            }
        }
    };

    const endConnection = async () => {
        try {
            await conversation.endSession();
            addLog('✅ Session ended');
        } catch (error: unknown) {
            if (error instanceof Error) {
                addLog(`❌ Failed to end: ${error.message}`);
            }
        }
    };

    const sendTestMessage = async () => {
        try {
            if (typeof conversation.sendUserMessage === 'function') {
                await conversation.sendUserMessage('Hello, can you hear me?');
                addLog('✅ Test message sent');
            } else {
                addLog('⚠️ sendUserMessage not available');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                addLog(`❌ Failed to send: ${error.message}`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">🔍 ElevenLabs Diagnostic Tool</h1>

                {/* Configuration */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Agent ID</label>
                            <input
                                type="text"
                                value={agentId}
                                onChange={(e) => setAgentId(e.target.value)}
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                                placeholder="Enter ElevenLabs Agent ID"
                            />
                            {!agentId && (
                                <p className="text-red-400 text-sm mt-2">
                                    ⚠️ NEXT_PUBLIC_ELEVENLABS_AGENT_ID not set in .env.local
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Controls</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={testConnection}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                        >
                            🎤 Start Connection
                        </button>
                        <button
                            onClick={endConnection}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium"
                        >
                            🛑 End Connection
                        </button>
                        <button
                            onClick={sendTestMessage}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                        >
                            💬 Send Test Message
                        </button>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Connection Status</h2>
                    <div className="space-y-2">
                        <p>Status: {conversation.status}</p>
                        <p>Is Connected: {conversation.isSpeaking ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                {/* Logs */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Event Log</h2>
                        <button
                            onClick={() => setLogs([])}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                        >
                            Clear Logs
                        </button>
                    </div>
                    <div className="bg-gray-900 rounded p-4 h-96 overflow-y-auto font-mono text-sm">
                        {logs.length === 0 ? (
                            <p className="text-gray-500">No logs yet. Click &quot;Start Connection&quot; to begin.</p>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="mb-1">
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-bold mb-2">📝 Instructions</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Make sure your Agent ID is set above</li>
                        <li>Click &quot;Start Connection&quot; - you&apos;ll be asked for microphone permission</li>
                        <li>Watch the logs for connection status</li>
                        <li>Try speaking or click &quot;Send Test Message&quot;</li>
                        <li>Check if you get a response in the logs</li>
                    </ol>
                </div>

                {/* Troubleshooting */}
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-bold mb-2">🔧 Common Issues</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li><strong>No Agent ID:</strong> Set NEXT_PUBLIC_ELEVENLABS_AGENT_ID in .env.local</li>
                        <li><strong>Connection fails:</strong> Check agent exists at elevenlabs.io/app/conversational-ai</li>
                        <li><strong>No response:</strong> Agent might not be configured with a system prompt</li>
                        <li><strong>Microphone error:</strong> Allow microphone access in browser settings</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
