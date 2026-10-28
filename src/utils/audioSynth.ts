/**
 * Procedural Web Audio API soundscape generator.
 * Provides pure, comforting ambient rain, distant thunder, and cozy lofi chords.
 * Fully self-contained, no external bandwidth needed, works offline and in any browser.
 */

class CozySoundGenerator {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;
  private musicInterval: any = null;
  private isRainPlaying = false;
  private isSynthMusicPlaying = false;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate realistic pink/brown noise for rain
  public startRain(volume = 0.4) {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      if (this.isRainPlaying) return;

      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      // Brown/Pink noise approximation for rain
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter for rainfall patter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(850, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), this.ctx.currentTime + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      this.rainNode = noise;
      this.rainGain = gain;
      this.isRainPlaying = true;
    } catch (err) {
      console.warn('Could not start procedural rain audio:', err);
    }
  }

  public setRainVolume(volume: number) {
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(Math.max(0.001, volume), this.ctx.currentTime);
    }
  }

  public stopRain() {
    if (this.rainNode && this.rainGain && this.ctx) {
      try {
        this.rainGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          if (this.rainNode) {
            (this.rainNode as AudioBufferSourceNode).stop();
            this.rainNode.disconnect();
            this.rainNode = null;
          }
          this.isRainPlaying = false;
        }, 900);
      } catch (_) {
        this.isRainPlaying = false;
      }
    } else {
      this.isRainPlaying = false;
    }
  }

  public toggleRain(volume = 0.4): boolean {
    if (this.isRainPlaying) {
      this.stopRain();
      return false;
    } else {
      this.startRain(volume);
      return true;
    }
  }

  public getRainState(): boolean {
    return this.isRainPlaying;
  }

  // Procedural multi-style music synthesizers
  private activeSynthStyle: string = 'lofi';

  public playTrackSynth(styleId: string = 'lofi') {
    this.stopTrackSynth();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isSynthMusicPlaying = true;
    this.activeSynthStyle = styleId;

    if (styleId.includes('period') || styleId === 'period-care') {
      this.startPeriodHealingFreq();
    } else if (styleId.includes('rain') || styleId === 'cloudy-day') {
      this.startLofiRainSynth();
    } else if (styleId.includes('moon') || styleId.includes('night') || styleId === 'forest-lullaby') {
      this.startMoonlightArpSynth();
    } else if (styleId.includes('cuddle') || styleId.includes('heart')) {
      this.startHeartbeatCuddleSynth();
    } else {
      this.startLofiRainSynth();
    }
  }

  // 1. Period Care Healing 432Hz Tone + Gentle Warm Pad
  private startPeriodHealingFreq() {
    if (!this.ctx || !this.masterGain || !this.isSynthMusicPlaying) return;

    const baseFreqs = [216, 432, 648]; // Harmonic healing 432Hz
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), this.ctx.currentTime + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      oscs.push(osc);
      gains.push(gain);
    });

    // Slow soothing pulse
    let chordStep = 0;
    const warmChords = [
      [288, 360, 432], // F# major warm
      [270, 324, 405], // E major warm
      [240, 288, 360], // D major warm
    ];

    this.musicInterval = setInterval(() => {
      if (!this.isSynthMusicPlaying || !this.ctx || !this.masterGain) return;
      const notes = warmChords[chordStep % warmChords.length];
      chordStep++;

      notes.forEach((f, i) => {
        if (!this.ctx || !this.masterGain) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, this.ctx.currentTime);
        const t = this.ctx.currentTime + i * 0.2;
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.05, t + 1.2);
        g.gain.exponentialRampToValueAtTime(0.001, t + 4.5);
        o.connect(g);
        g.connect(this.masterGain);
        o.start(t);
        o.stop(t + 4.8);
      });
    }, 4500);
  }

  // 2. Lofi Rain Chords (Warm Rhodes Piano)
  private startLofiRainSynth() {
    if (!this.ctx || !this.masterGain || !this.isSynthMusicPlaying) return;

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj9
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 329.63], // G6
    ];
    let step = 0;

    const playNext = () => {
      if (!this.isSynthMusicPlaying || !this.ctx || !this.masterGain) return;
      const notes = chords[step % chords.length];
      step++;

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(550 + idx * 70, this.ctx.currentTime);

        const now = this.ctx.currentTime + (idx * 0.14);
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.09, now + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.6);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 3.8);
      });
    };

    playNext();
    this.musicInterval = setInterval(playNext, 3800);
  }

  // 3. Moonlight Arpeggio Lullaby (Music Box / Celesta)
  private startMoonlightArpSynth() {
    if (!this.ctx || !this.masterGain || !this.isSynthMusicPlaying) return;

    const melody = [587.33, 659.25, 739.99, 880.00, 739.99, 659.25]; // D, E, F#, A
    let noteIdx = 0;

    this.musicInterval = setInterval(() => {
      if (!this.isSynthMusicPlaying || !this.ctx || !this.masterGain) return;
      const freq = melody[noteIdx % melody.length];
      noteIdx++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
    }, 700);
  }

  // 4. Heartbeat Cuddle Synth
  private startHeartbeatCuddleSynth() {
    if (!this.ctx || !this.masterGain || !this.isSynthMusicPlaying) return;

    const playHeartbeatPulse = () => {
      if (!this.isSynthMusicPlaying || !this.ctx || !this.masterGain) return;
      // Lub
      const o1 = this.ctx.createOscillator();
      const g1 = this.ctx.createGain();
      o1.type = 'sine';
      o1.frequency.setValueAtTime(55, this.ctx.currentTime);
      o1.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.15);
      g1.gain.setValueAtTime(0.12, this.ctx.currentTime);
      g1.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      o1.connect(g1);
      g1.connect(this.masterGain);
      o1.start();
      o1.stop(this.ctx.currentTime + 0.2);

      // Dub
      const o2 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(62, this.ctx.currentTime + 0.22);
      o2.frequency.exponentialRampToValueAtTime(38, this.ctx.currentTime + 0.38);
      g2.gain.setValueAtTime(0.09, this.ctx.currentTime + 0.22);
      g2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.42);
      o2.connect(g2);
      g2.connect(this.masterGain);
      o2.start(this.ctx.currentTime + 0.22);
      o2.stop(this.ctx.currentTime + 0.45);
    };

    playHeartbeatPulse();
    this.musicInterval = setInterval(playHeartbeatPulse, 1200);
  }

  public stopTrackSynth() {
    this.isSynthMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public startSynthMusic() {
    this.playTrackSynth('lofi');
  }

  public stopSynthMusic() {
    this.stopTrackSynth();
  }

  public getSynthMusicState(): boolean {
    return this.isSynthMusicPlaying;
  }

  // Play peaceful pleasant interaction chime
  public playComfortChime(type: 'star' | 'heart' | 'success' | 'click' | 'wind' = 'star') {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const freqs: Record<string, number[]> = {
        star: [523.25, 659.25, 783.99], // C5, E5, G5
        heart: [440.00, 554.37, 659.25], // A4, C#5, E5
        success: [392.00, 523.25, 659.25, 783.99],
        click: [400],
        wind: [329.63, 392.00, 493.88], // E4, G4, B4
      };

      const selected = freqs[type] || freqs.star;
      selected.forEach((f, i) => {
        if (!this.ctx || !this.masterGain) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.08);

        const t = this.ctx.currentTime + i * 0.08;
        g.gain.setValueAtTime(0.01, t);
        g.gain.linearRampToValueAtTime(0.07, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

        o.connect(g);
        g.connect(this.masterGain);
        o.start(t);
        o.stop(t + 0.65);
      });
    } catch (_) {}
  }
}

export const soundManager = new CozySoundGenerator();
