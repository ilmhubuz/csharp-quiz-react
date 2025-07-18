interface QuizSession {
    sessionId: string;
    collectionId: number;
    collectionName: string;
    questions: Array<{
        id: number;
        type: string;
        prompt: string;
        content: any;
        options?: Array<{ id: string; option: string }>;
    }>;
    answers: { [questionId: number]: string | string[] };
    startedAt: string;
    lastActivityAt: string;
}

class SessionStorageService {
    private readonly SESSION_KEY = 'csharp_quiz_session';
    private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

    private generateSessionId(): string {
        return `preview-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    createSession(
        collectionId: number,
        collectionName: string,
        questions: any[]
    ): string {
        const sessionId = this.generateSessionId();
        const session: QuizSession = {
            sessionId,
            collectionId,
            collectionName,
            questions: questions.map(q => ({
                id: q.id,
                type: q.type,
                prompt: q.content.prompt,
                content: q.content,
                options: q.options,
            })),
            answers: {},
            startedAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString(),
        };

        window.sessionStorage.setItem(
            this.SESSION_KEY,
            JSON.stringify(session)
        );
        return sessionId;
    }

    getCurrentSession(): QuizSession | null {
        try {
            const sessionData = window.sessionStorage.getItem(this.SESSION_KEY);
            if (!sessionData) return null;

            const session: QuizSession = JSON.parse(sessionData);

            // Check if session has expired
            const lastActivity = new Date(session.lastActivityAt).getTime();
            const now = Date.now();

            if (now - lastActivity > this.SESSION_TIMEOUT) {
                this.clearSession();
                return null;
            }

            return session;
        } catch (error) {
            console.error('Failed to parse session data:', error);
            this.clearSession();
            return null;
        }
    }

    updateAnswer(questionId: number, answer: string | string[]): void {
        const session = this.getCurrentSession();
        if (!session) return;

        session.answers[questionId] = answer;
        session.lastActivityAt = new Date().toISOString();

        window.sessionStorage.setItem(
            this.SESSION_KEY,
            JSON.stringify(session)
        );
    }

    getAnswers(): { [questionId: number]: string | string[] } {
        const session = this.getCurrentSession();
        return session?.answers || {};
    }

    getSessionId(): string | null {
        const session = this.getCurrentSession();
        return session?.sessionId || null;
    }

    getCollectionId(): number | null {
        const session = this.getCurrentSession();
        return session?.collectionId || null;
    }

    getCollectionName(): string | null {
        const session = this.getCurrentSession();
        return session?.collectionName || null;
    }

    getQuestions(): any[] {
        const session = this.getCurrentSession();
        return session?.questions || [];
    }

    isSessionActive(): boolean {
        return this.getCurrentSession() !== null;
    }

    clearSession(): void {
        window.sessionStorage.removeItem(this.SESSION_KEY);
    }

    getAnsweredCount(): number {
        const session = this.getCurrentSession();
        if (!session) return 0;

        return Object.keys(session.answers).length;
    }

    getTotalQuestions(): number {
        const session = this.getCurrentSession();
        return session?.questions.length || 0;
    }

    isComplete(): boolean {
        const session = this.getCurrentSession();
        if (!session) return false;

        return Object.keys(session.answers).length === session.questions.length;
    }
}

export const sessionStorage = new SessionStorageService();
