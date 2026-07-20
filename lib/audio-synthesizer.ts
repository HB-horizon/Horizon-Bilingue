class AudioSynthesizer {
  private ctx: AudioContext | null = null;

  private async getCtx(): Promise<AudioContext | null> {
    if (typeof window === 'undefined') return null;
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    if (!this.ctx) this.ctx = new AC();
    const ctx: AudioContext = this.ctx!;
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx;
  }

  async playLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra'): Promise<void> {
    const ctx = await this.getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const freqs: Record<string, number> = { fatha: 440, damma: 550, kasra: 660 };
      osc.frequency.value = freqs[harakat] || 440;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('[AudioSynthesizer] Error playing letter:', e);
    }
  }

  async playRuleSound(ruleName: string): Promise<void> {
    const ctx = await this.getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const freqs: Record<string, number> = { 'Alif': 523, 'Hamza': 659, 'Prolongation': 784 };
      osc.frequency.value = freqs[ruleName] || 440;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {
      console.warn('[AudioSynthesizer] Error playing rule:', e);
    }
  }

  async playSuccessSound(): Promise<void> {
    const ctx = await this.getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 2; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const t = now + i * 0.15;
        osc.frequency.value = [523, 659][i];
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
      }
    } catch (e) {
      console.warn('[AudioSynthesizer] Error playing success:', e);
    }
  }

  async playClickSound(): Promise<void> {
    const ctx = await this.getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('[AudioSynthesizer] Error playing click:', e);
    }
  }

  async playErrorSound(): Promise<void> {
    const ctx = await this.getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 200;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('[AudioSynthesizer] Error playing error:', e);
    }
  }
}

export const audioSynthesizer = new AudioSynthesizer();

export async function playLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra') {
  await audioSynthesizer.playLetterSound(letter, harakat);
}

export async function playRuleSound(ruleName: string) {
  await audioSynthesizer.playRuleSound(ruleName);
}

export async function playSuccessSound() {
  await audioSynthesizer.playSuccessSound();
}

export async function playErrorSound() {
  await audioSynthesizer.playErrorSound();
}
