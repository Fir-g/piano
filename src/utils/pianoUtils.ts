import { PianoKey } from '../types';
import * as Tone from 'tone';

// Map keyboard keys to piano notes
export const keyboardMap: Record<string, string> = {
  'a': 'C',
  'w': 'C#',
  's': 'D',
  'e': 'D#',
  'd': 'E',
  'f': 'F',
  't': 'F#',
  'g': 'G',
  'y': 'G#',
  'h': 'A',
  'u': 'A#',
  'j': 'B',
  'k': 'C',
  'o': 'C#',
  'l': 'D',
  'p': 'D#',
  ';': 'E',
};

// Generate piano keys for a specific number of octaves
export const generatePianoKeys = (startOctave: number, octaves: number): PianoKey[] => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const keys: PianoKey[] = [];
  const keyboardKeys = Object.keys(keyboardMap);
  let keyboardIndex = 0;

  for (let octave = startOctave; octave < startOctave + octaves; octave++) {
    notes.forEach((note) => {
      const isBlack = note.includes('#');
      let keyboardKey;

      if (keyboardIndex < keyboardKeys.length) {
        keyboardKey = keyboardKeys[keyboardIndex];
        keyboardIndex++;
      }

      keys.push({
        note,
        octave,
        isBlack,
        keyboardKey,
      });
    });
  }

  return keys;
};

// Initialize Tone.js synth
let synth: Tone.PolySynth | null = null;

export const initAudio = async () => {
  await Tone.start();
  synth = new Tone.PolySynth(Tone.Synth).toDestination();
};

export const playNote = (note: string, octave: number, duration = '8n') => {
  if (!synth) {
    console.error('Synth not initialized');
    return;
  }
  
  const fullNote = `${note}${octave}`;
  synth.triggerAttackRelease(fullNote, duration);
  return fullNote;
};

export const getNoteFromKeyboardKey = (key: string): { note: string; octave: number } | null => {
  const note = keyboardMap[key];
  
  if (!note) return null;
  
  // Hard-coded octave mapping for simplicity in MVP
  // Will be improved in future versions
  const octave = key === 'k' || key === 'o' || key === 'l' || key === 'p' || key === ';' ? 4 : 3;
  
  return { note, octave };
};