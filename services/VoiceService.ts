import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import { Audio } from "expo-av";
import { Platform } from "react-native";

interface StartSessionRequest {
  language?: string;
  deviceInfo?: string;
  isOffline?: boolean;
}

interface VoiceResponse {
  text?: string;
  audioUrl?: string;
  audioBase64?: string;
  meta?: Record<string, any>;
}

class VoiceService {
  private apiBaseUrl: string;
  private sessionId: string | null = null;
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private webRecorder: any = null;
  private webChunks: any[] = [];

  constructor() {
    const manifest: any = Constants?.expoConfig || (Constants as any).manifest || {};
    this.apiBaseUrl = manifest?.extra?.API_BASE_URL || "http://localhost:3000";
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  async startSession(req: StartSessionRequest = {}): Promise<string> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/api/voice/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const id = json?.sessionId || json?.id || json;
      this.sessionId = String(id);
      return this.sessionId!;
    } catch {
      // fallback session id
      const id = Math.random().toString(36).slice(2, 10);
      this.sessionId = id;
      return id;
    }
  }

  async endSession(): Promise<void> {
    if (!this.sessionId) return;
    try {
      await fetch(`${this.apiBaseUrl}/api/voice/sessions/${this.sessionId}/end`, {
        method: "POST",
      });
    } catch {}
    this.sessionId = null;
  }

  async sendText(text: string, speakResponse = true, language?: string): Promise<VoiceResponse> {
    if (!this.sessionId) await this.startSession({ language });
    const res = await fetch(`${this.apiBaseUrl}/api/voice/sessions/${this.sessionId}/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, speakResponse, language }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    await this.maybePlayAudio(data);
    return data;
  }

  async startRecording(): Promise<void> {
    if (Platform.OS === "web") {
      const stream = await (navigator.mediaDevices as any).getUserMedia({ audio: true });
      this.webChunks = [];
      const recorder = new (window as any).MediaRecorder(stream);
      recorder.ondataavailable = (e: any) => {
        if (e.data && e.data.size > 0) this.webChunks.push(e.data);
      };
      recorder.start();
      this.webRecorder = recorder;
      return;
    }
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) throw new Error("Microphone permission not granted");
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    this.recording = rec;
  }

  async stopAndSendAudio(speakResponse = true): Promise<VoiceResponse> {
    let payload: any = { speakResponse };
    if (Platform.OS === "web") {
      if (!this.webRecorder) throw new Error("Recording not started");
      const recorder = this.webRecorder;
      const stopped = new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
      });
      recorder.stop();
      await stopped;
      const blob = new Blob(this.webChunks, { type: "audio/webm" });
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = String(reader.result || "");
          const prefix = "base64,";
          const idx = res.indexOf(prefix);
          resolve(idx >= 0 ? res.slice(idx + prefix.length) : res);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      payload.audioBase64 = base64;
      payload.format = "webm";
      payload.sampleRate = 44100;
      this.webRecorder = null;
      this.webChunks = [];
    } else {
      if (!this.recording) throw new Error("Recording not started");
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      if (!uri) throw new Error("Failed to get recording URI");
      const audioBase64 = await FileSystem.readAsStringAsync(uri, { encoding: (FileSystem as any).EncodingType.Base64 });
      payload.audioBase64 = audioBase64;
      payload.format = "m4a";
      payload.sampleRate = 44100;
    }

    if (!this.sessionId) await this.startSession();
    const res = await fetch(`${this.apiBaseUrl}/api/voice/sessions/${this.sessionId}/audio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    await this.maybePlayAudio(data);
    return data;
  }

  private async maybePlayAudio(resp: VoiceResponse): Promise<void> {
    const audioUrl = resp?.audioUrl;
    const audioBase64 = resp?.audioBase64;
    if (!audioUrl && !audioBase64) return;
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
      } catch {}
      this.sound = null;
    }
    const sound = new Audio.Sound();
    if (audioUrl) {
      await sound.loadAsync({ uri: audioUrl }, { shouldPlay: true });
    } else if (audioBase64) {
      const uri = `${FileSystem.cacheDirectory}resp-${Date.now()}.m4a`;
      await FileSystem.writeAsStringAsync(uri, audioBase64, { encoding: FileSystem.EncodingType.Base64 });
      await sound.loadAsync({ uri }, { shouldPlay: true });
    }
    this.sound = sound;
  }
}

export const voiceService = new VoiceService();
export default voiceService;
