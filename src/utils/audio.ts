// Web Audio synthetic ringtone generator for realistic incoming call
let audioCtx: AudioContext | null = null;
let ringInterval: any = null;

export function playPhoneRingtone(): () => void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return () => {};

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const playToneBurst = () => {
      if (!audioCtx) return;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // Standard North American/telecom gentle dual-tone ringing frequencies (440Hz + 480Hz)
      osc1.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(480, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(audioCtx.currentTime);
      osc2.start(audioCtx.currentTime);

      osc1.stop(audioCtx.currentTime + 1.6);
      osc2.stop(audioCtx.currentTime + 1.6);
    };

    playToneBurst();
    ringInterval = setInterval(playToneBurst, 3000);

    return () => {
      if (ringInterval) {
        clearInterval(ringInterval);
        ringInterval = null;
      }
    };
  } catch (e) {
    console.error('Audio ringtone error', e);
    return () => {};
  }
}

// Speak Arabic text using Web Speech API
export function speakArabicText(text: string, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.9; // Slightly slower for elderly comprehension
  utterance.pitch = 1.0;

  // Try to find Arabic voice
  const voices = window.speechSynthesis.getVoices();
  const arVoice = voices.find((v) => v.lang.startsWith('ar'));
  if (arVoice) {
    utterance.voice = arVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopArabicSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
