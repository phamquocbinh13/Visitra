import { RecognitionEvent, RecognitionResult, RecognitionStatus } from '@/types';

// Future API Base URL (configured via environment variable, defaulting to API boundary)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export class RecognitionService {
  private static initialHistory: RecognitionEvent[] = [
    {
      id: '1',
      time: '14:22:01.842',
      name: 'Nguyen Van A',
      identifier: 'SV001',
      score: '94.2%',
      status: 'AUTHORIZED',
      terminal: 'Gate-A North',
      latency: '14.2ms',
    },
    {
      id: '2',
      time: '14:20:45.109',
      name: 'Sarah Lin',
      identifier: 'EMP-042',
      score: '96.8%',
      status: 'AUTHORIZED',
      terminal: 'Executive Lobby',
      latency: '11.8ms',
    },
    {
      id: '3',
      time: '14:18:12.440',
      name: 'Marcus Chen',
      identifier: 'VIS-881',
      score: '89.4%',
      status: 'AUTHORIZED',
      terminal: 'Visitor Kiosk',
      latency: '15.6ms',
    },
  ];

  /**
   * Perform recognition simulation or API call.
   * In Phase 1, uses mock state machine; in Phase 2, connects to POST /api/recognize.
   */
  public static async recognize(photoBase64OrUrl?: string): Promise<RecognitionResult> {
    if (API_BASE_URL && API_BASE_URL.startsWith('http://real-backend')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/recognize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: photoBase64OrUrl }),
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Backend API connection fallback to mock recognition service:', err);
      }
    }

    // Default Phase 1 Mock Behavior
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      matched: true,
      similarity: 94.8,
      status: 'AUTHORIZED',
      timestamp: new Date().toISOString(),
      terminal: 'Gate-A North',
      latencyMs: 14.2,
    };
  }

  /**
   * Returns current telemetry history events.
   */
  public static getHistory(): RecognitionEvent[] {
    return this.initialHistory;
  }

  /**
   * Prepend a new event to the telemetry history.
   */
  public static addHistoryEvent(
    name: string,
    identifier: string,
    score: string,
    status: RecognitionStatus,
    terminal = 'Gate-A North',
    latency = '15.1ms'
  ): RecognitionEvent {
    const now = new Date();
    const timeStr =
      now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const newEvent: RecognitionEvent = {
      id: Date.now().toString(),
      time: timeStr,
      name,
      identifier,
      score,
      status,
      terminal,
      latency,
    };

    this.initialHistory = [newEvent, ...this.initialHistory];
    return newEvent;
  }
}
