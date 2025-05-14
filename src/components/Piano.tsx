import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PianoKey from './PianoKey';
import { Piano as PianoType, Note } from '../types';
import { generatePianoKeys, initAudio, getNoteFromKeyboardKey } from '../utils/pianoUtils';

interface PianoProps extends PianoType {
  isRecording: boolean;
  onNotePlay?: (note: string) => void;
}

const Piano: React.FC<PianoProps> = ({ 
  octaves = 2, 
  startOctave = 3, 
  isRecording,
  onNotePlay 
}) => {
  const [keys, setKeys] = useState(generatePianoKeys(startOctave, octaves));
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    // Initialize Tone.js on component mount
    const setupAudio = async () => {
      await initAudio();
      setAudioInitialized(true);
    };
    
    setupAudio();
  }, []);

  useEffect(() => {
    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Prevent repeating when key is held down
      
      const result = getNoteFromKeyboardKey(e.key);
      if (result) {
        const { note, octave } = result;
        const fullNote = note + octave;
        const playedNote = playNote(note, octave);
        
        if (playedNote && onNotePlay && isRecording) {
          onNotePlay(playedNote);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRecording, onNotePlay]);

  const handleKeyPlay = (note: string) => {
    if (onNotePlay && isRecording) {
      onNotePlay(note);
    }
  };

  return (
    <div className="mb-8">
      <motion.div 
        className="relative flex justify-center items-start piano-container overflow-x-auto py-4 px-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!audioInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
            <button 
              className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700"
              onClick={async () => {
                await initAudio();
                setAudioInitialized(true);
              }}
            >
              Click to Initialize Audio
            </button>
          </div>
        )}
        <div className="flex">
          {keys.map((key, index) => (
            <PianoKey 
              key={`${key.note}${key.octave}-${index}`} 
              pianoKey={key} 
              onKeyPlay={handleKeyPlay}
            />
          ))}
        </div>
      </motion.div>
      <div className="text-center text-sm text-gray-600 mt-2">
        Use your computer keyboard to play notes or click on piano keys.
        {isRecording && (
          <span className="ml-2 text-red-500 font-semibold animate-pulse">
            Recording...
          </span>
        )}
      </div>
    </div>
  );
};

export default Piano;