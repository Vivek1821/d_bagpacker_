// Web Audio Synth Engine for Exploration & Travel Soundtracks
// Zero external file dependency, 0ms latency, works everywhere!

class TravelAudioEngine {
  private ctx: AudioContext | null = null;
  private currentTrackId: string | null = null;
  private isPlaying: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private gainNode: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Play generative travel / riding / nature beat
  public playTrack(trackType: "riding" | "nature" | "cinematic" | "chill" = "cinematic", onProgress?: (time: number) => void) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.gainNode = masterGain;

    let step = 0;

    // Chord progressions depending on track type
    const chords =
      trackType === "riding"
        ? [130.81, 146.83, 164.81, 174.61] // Driving bass
        : trackType === "nature"
        ? [261.63, 329.63, 392.0, 523.25] // Acoustic open notes
        : trackType === "chill"
        ? [220.0, 261.63, 329.63, 440.0] // Lofi warm chords
        : [174.61, 220.0, 261.63, 349.23]; // Epic cinematic sweep

    this.intervalId = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;

      const baseFreq = chords[step % chords.length];
      step++;

      // Synth melodic chord pulse
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = trackType === "riding" ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      noteGain.gain.setValueAtTime(0.18, ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start();
      osc.stop(ctx.currentTime + 0.55);

      // Add gentle percussion / travel kick on beat 1 & 3
      if (step % 2 === 0) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.frequency.setValueAtTime(trackType === "riding" ? 110 : 80, ctx.currentTime);
        kickOsc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.2);
        kickGain.gain.setValueAtTime(0.3, ctx.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        kickOsc.connect(kickGain);
        kickGain.connect(masterGain);
        kickOsc.start();
        kickOsc.stop(ctx.currentTime + 0.2);
      }

      if (onProgress) {
        onProgress(step);
      }
    }, 380);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      } catch {}
    }
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }
}

export const travelAudio = new TravelAudioEngine();
