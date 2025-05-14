import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PianoKey as PianoKeyType } from '../types';
import { playNote } from '../utils/pianoUtils';

interface PianoKeyProps {
  pianoKey: PianoKeyType;
  onKeyPlay?: (note: string) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({ pianoKey, onKeyPlay }) => {
  const [isPressed, setIsPressed] = useState(false);
  const { note, octave, isBlack, keyboardKey } = pianoKey;

  const handlePlay = () => {
    const fullNote = playNote(note, octave);
    if (fullNote && onKeyPlay) {
      onKeyPlay(fullNote);
    }
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <motion.div
      className={`relative ${isBlack ? 'z-10' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className={`
          ${isBlack 
            ? 'bg-black text-white h-32 w-10 -mx-5 absolute' 
            : 'bg-white border border-gray-300 text-black h-48 w-14'
          }
          ${isPressed ? (isBlack ? 'bg-gray-700' : 'bg-gray-100') : ''}
          rounded-b-md flex flex-col justify-end items-center pb-2
          transition-colors
        `}
        whileTap={{ y: 2, backgroundColor: isBlack ? '#333' : '#eee' }}
        onMouseDown={handlePlay}
        onTouchStart={handlePlay}
      >
        {keyboardKey && (
          <span className={`text-xs ${isBlack ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
            {keyboardKey.toUpperCase()}
          </span>
        )}
        <span className="text-xs">{`${note}${octave}`}</span>
      </motion.button>
    </motion.div>
  );
};

export default PianoKey;