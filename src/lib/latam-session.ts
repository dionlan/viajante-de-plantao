// src/lib/latam-session.ts
export interface LatamSession {
    token: string;
    cookies: string;
    sessionId: string;
    requestId: string;
    trackId: string;
    userAgent: string;
    captchaToken: string;
    actionName: string;
    capturedOffersUrl?: string;
}