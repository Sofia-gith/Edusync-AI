export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ConversationSession {
  sessionId: string;
  messages: ConversationMessage[];
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface IContextService {
  createSession(): string;
  addMessage(
    sessionId: string,
    role: "user" | "assistant",
    content: string
  ): void;
  getHistory(sessionId: string): ConversationMessage[] | undefined;
  getFormattedContext(sessionId: string): string;
  sessionExists(sessionId: string): boolean;
  deleteSession(sessionId: string): void;
  cleanupExpiredSessions(): void;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

class ContextService implements IContextService {
  private sessions = new Map<string, ConversationSession>();
  private ttlMs = 24 * 60 * 60 * 1000; // 24h

  createSession(): string {
    const id = randomId();
    const now = new Date();
    this.sessions.set(id, {
      sessionId: id,
      messages: [],
      createdAt: now,
      lastAccessedAt: now,
    });
    return id;
  }

  addMessage(
    sessionId: string,
    role: "user" | "assistant",
    content: string
  ): void {
    const s = this.sessions.get(sessionId);
    if (!s) return;
    s.messages.push({ role, content, timestamp: new Date() });
    s.lastAccessedAt = new Date();
  }

  getHistory(sessionId: string): ConversationMessage[] | undefined {
    const s = this.sessions.get(sessionId);
    if (!s) return undefined;
    s.lastAccessedAt = new Date();
    return s.messages.slice();
  }

  getFormattedContext(sessionId: string): string {
    const history = this.getHistory(sessionId);
    if (!history || history.length === 0) return "";
    return history
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");
  }

  sessionExists(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [id, s] of this.sessions.entries()) {
      if (now - s.lastAccessedAt.getTime() > this.ttlMs) {
        this.sessions.delete(id);
      }
    }
  }
}

export const contextService = new ContextService();
export default contextService;

