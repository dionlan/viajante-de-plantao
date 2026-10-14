// src/lib/uuid.ts

/**
 * Gera um UUID v4 no mesmo formato que a LATAM usa no cliente dela.
 *
 * Formato: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *   - 'x' → 0-9a-f (aleatório)
 *   - '4' → fixo (versão 4 do UUID)
 *   - 'y' → 8, 9, a ou b (variante RFC 4122)
 *
 * Compatível com:
 *   - x-latam-app-session-id
 *   - x-latam-request-id
 *   - x-latam-track-id
 */
export function generateLatamUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}