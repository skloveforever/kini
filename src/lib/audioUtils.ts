let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedAudioCtx) {
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    sharedAudioCtx = new AudioContextClass();
  }
  return sharedAudioCtx;
}

export async function resumeAudioContext(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
}

export async function playPCM(base64Data: string, sampleRate: number = 24000): Promise<void> {
  try {
    // Faster base64 to Uint8Array conversion
    const binaryString = window.atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Convert 16-bit PCM to Float32 using Int16Array for speed
    // 16-bit PCM is 2 bytes per sample
    const int16Data = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(int16Data.length);
    
    for (let i = 0; i < int16Data.length; i++) {
      floatData[i] = int16Data[i] / 32768.0;
    }

    const audioCtx = getAudioContext();
    await resumeAudioContext();

    const buffer = audioCtx.createBuffer(1, floatData.length, sampleRate);
    buffer.copyToChannel(floatData, 0);
    
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    
    // Add a very small gain node to prevent clipping and allow smooth transitions
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    return new Promise((resolve) => {
      let resolved = false;
      const finish = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      source.onended = finish;
      
      // Safety timeout: message length in seconds + 2s buffer
      const duration = buffer.duration * 1000;
      setTimeout(finish, duration + 2000);

      source.start();
    });
  } catch (error) {
    console.error("Error playing PCM audio:", error);
    throw error;
  }
}
