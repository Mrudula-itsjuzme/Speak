import { useState, useCallback } from 'react';
import { saveSession, updateUserProfile, getUserProfile, getCurriculumProgress, saveCurriculumProgress } from '@/lib/memory/sessionStore';
import { generateSessionSummary } from '@/lib/openrouter/client';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  correction?: string;
}

export function useVoiceMemory() {
  const [isSaving, setIsSaving] = useState(false);

  const endSession = useCallback(async (
    messages: ChatMessage[],
    language: string,
    personalityId: string,
    currentTopic: string
  ) => {
    if (messages.length === 0) return;

    setIsSaving(true);
    try {
      const sessionId = uuidv4();
      const startTime = messages[0].timestamp.getTime();
      const endTime = Date.now();

      // Convert messages to transcript for Gemini
      const transcript = messages
        .map(m => `${m.type.toUpperCase()}: ${m.content}`)
        .join('\n');

      // Generate AI summary
      const analysis = await generateSessionSummary(transcript);

      // Save to IndexedDB
      await saveSession({
        id: sessionId,
        startTime,
        endTime,
        language,
        personalityId,
        messages: messages.map(m => ({
          role: m.type,
          content: m.content,
          timestamp: m.timestamp.getTime(),
          correction: m.correction
        })),
        summary: analysis?.summary,
        mistakes: analysis?.mistakes || [],
        vocabulary: analysis?.vocabulary || [],
        emotions: analysis?.emotions || []
      });

      // Update Curriculum Progress
      try {
        const storedCurriculum = await getCurriculumProgress(language);
        // We import curriculums here to avoid circular dependency if it was in sessionStore
        const { curriculums } = await import('@/lib/curriculum');
        const staticCurriculum = curriculums[language.toLowerCase()] || curriculums.default;

        let items = storedCurriculum?.items || staticCurriculum.items;

        // Find current topic and mark as completed if summary confirms
        const updatedItems = items.map(item => {
          if (item.id === currentTopic) {
            return { ...item, status: 'completed' as const };
          }
          return item;
        });

        // Mark the next item as in-progress if one exists
        const currentIndex = updatedItems.findIndex(i => i.status === 'completed' && i.id === currentTopic);
        if (currentIndex !== -1 && currentIndex + 1 < updatedItems.length) {
          if (updatedItems[currentIndex + 1].status === 'locked') {
            updatedItems[currentIndex + 1] = { ...updatedItems[currentIndex + 1], status: 'in-progress' as const };
          }
        }

        await saveCurriculumProgress(language, updatedItems);
        console.log('Curriculum updated for:', currentTopic);
      } catch (curricError) {
        console.error('Failed to update curriculum:', curricError);
      }

      // Update User Profile
      const profile = await getUserProfile();
      const lastPractice = new Date(profile?.lastPracticeDate || 0);
      const today = new Date();
      const isConsecutiveDay =
        today.getDate() === lastPractice.getDate() + 1 &&
        today.getMonth() === lastPractice.getMonth() &&
        today.getFullYear() === lastPractice.getFullYear();

      const isSameDay =
        today.getDate() === lastPractice.getDate() &&
        today.getMonth() === lastPractice.getMonth() &&
        today.getFullYear() === lastPractice.getFullYear();

      await updateUserProfile({
        totalSessions: (profile?.totalSessions || 0) + 1,
        lastPracticeDate: Date.now(),
        streakDays: isSameDay ? (profile?.streakDays || 0) : isConsecutiveDay ? (profile?.streakDays || 0) + 1 : 1
      });

      console.log('Session saved successfully:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Failed to save session:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    endSession,
    isSaving
  };
}
