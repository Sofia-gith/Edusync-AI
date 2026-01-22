import { Audio } from "expo-av";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
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
  private webAudioCtx: any = null;
  private webSourceNode: any = null;
  private webProcessorNode: any = null;
  private webStream: any = null;
  private webSamples: Float32Array[] = [];

  constructor() {
    const manifest: any =
      Constants?.expoConfig || (Constants as any).manifest || {};
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
      const id =
        (json && json.data && json.data.sessionId) ||
        json?.sessionId ||
        json?.id ||
        json;
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
      await fetch(
        `${this.apiBaseUrl}/api/voice/sessions/${this.sessionId}/end`,
        {
          method: "POST",
        },
      );
    } catch {}
    this.sessionId = null;
  }

  async sendText(
    text: string,
    speakResponse = true,
    language?: string,
  ): Promise<VoiceResponse> {
    if (!this.sessionId) await this.startSession({ language });
    let url = `${this.apiBaseUrl}/api/voice/sessions/${this.sessionId}/text`;
    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, speakResponse, language }),
    });
    if (!res.ok) {
      let shouldRetry = false;
      try {
        const errJson = await res.json();
        const code = errJson?.code || errJson?.errorCode;
        shouldRetry = code === "SESSION_NOT_FOUND";
      } catch {
        const errText = await res.text();
        shouldRetry = errText.includes("SESSION_NOT_FOUND");
      }
      if (shouldRetry) {
        await this.startSession({ language });
        url = `${this.apiBaseUrl}/api/voice/sessions/${this.sessionId}/text`;
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, speakResponse, language }),
        });
      }
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    await this.maybePlayAudio(data);
    return data;
  }

  async startRecording(): Promise<void> {
    if (Platform.OS === "web") {
      const stream = await (navigator.mediaDevices as any).getUserMedia({
        audio: true,
      });
      this.webStream = stream;
      this.webAudioCtx = new (window as any).AudioContext();
      this.webSourceNode = this.webAudioCtx.createMediaStreamSource(stream);
      // ScriptProcessor is widely supported; for modern browsers, AudioWorklet is preferred
      this.webProcessorNode = this.webAudioCtx.createScriptProcessor(
        4096,
        1,
        1,
      );
      this.webSamples = [];
      this.webProcessorNode.onaudioprocess = (event: any) => {
        const input = event.inputBuffer.getChannelData(0);
        // Copy the buffer to avoid referencing the same memory
        this.webSamples.push(new Float32Array(input));
      };
      this.webSourceNode.connect(this.webProcessorNode);
      this.webProcessorNode.connect(this.webAudioCtx.destination);
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
      if (!this.webAudioCtx || !this.webProcessorNode)
        throw new Error("Recording not started");
      // Stop graph
      try {
        this.webProcessorNode.disconnect();
        this.webSourceNode?.disconnect();
        if (this.webStream) {
          const tracks = this.webStream.getTracks?.() || [];
          tracks.forEach((t: any) => t.stop && t.stop());
        }
        this.webAudioCtx.close?.();
      } catch {}
      const sampleRate = this.webAudioCtx.sampleRate || 44100;
      const wavBlob = this.encodeWAV(this.webSamples, sampleRate);
      const base64 = await this.blobToBase64(wavBlob);
      payload.audioBase64 = base64;
      payload.format = "wav";
      payload.sampleRate = sampleRate;
      // Reset
      this.webAudioCtx = null;
      this.webSourceNode = null;
      this.webProcessorNode = null;
      this.webStream = null;
      this.webSamples = [];
    } else {
      if (!this.recording) throw new Error("Recording not started");
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      if (!uri) throw new Error("Failed to get recording URI");
      const audioBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: (FileSystem as any).EncodingType.Base64,
      });
      payload.audioBase64 = audioBase64;
      // Note: expo-av records m4a (AAC). Backend currently expects pcm/wav/mp3/opus.
      // If needed, backend should accept m4a, or a native module can be used to record WAV.
      payload.format = "m4a";
      payload.sampleRate = 44100;
    }

    if (!this.sessionId) await this.startSession();
    let url = `${this.apiBaseUrl}/api/voice/sessions/${this.sessionId}/audio`;
    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let shouldRetry = false;
      try {
        const errJson = await res.json();
        const code = errJson?.code || errJson?.errorCode;
        shouldRetry = code === "SESSION_NOT_FOUND";
      } catch {
        const errText = await res.text();
        shouldRetry = errText.includes("SESSION_NOT_FOUND");
      }
      if (shouldRetry) {
        await this.startSession();
        url = `${this.apiBaseUrl}/api/voice/sessions/${this.sessionId}/audio`;
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    }
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
      await FileSystem.writeAsStringAsync(uri, audioBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await sound.loadAsync({ uri }, { shouldPlay: true });
    }
    this.sound = sound;
  }

  private encodeWAV(chunks: Float32Array[], sampleRate: number): Blob {
    // Concatenate chunks
    const length = chunks.reduce((acc, cur) => acc + cur.length, 0);
    const buffer = new Float32Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }
    // Convert float [-1,1] to 16-bit PCM
    const pcm = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      let s = Math.max(-1, Math.min(1, buffer[i]));
      pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    // Build WAV header (mono, 16-bit PCM)
    const byteRate = sampleRate * 2;
    const blockAlign = 2;
    const dataSize = pcm.length * 2;
    const bufferSize = 44 + dataSize;
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);
    // RIFF
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, "WAVE");
    // fmt chunk
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // PCM header length
    view.setUint16(20, 1, true); // audio format = PCM
    view.setUint16(22, 1, true); // channels = 1
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // bits per sample
    // data chunk
    this.writeString(view, 36, "data");
    view.setUint32(40, dataSize, true);
    // PCM data
    let pos = 44;
    for (let i = 0; i < pcm.length; i++, pos += 2) {
      view.setInt16(pos, pcm[i], true);
    }
    return new Blob([view], { type: "audio/wav" });
  }

  private writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
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
  }
}

export const voiceService = new VoiceService();
export default voiceService;
