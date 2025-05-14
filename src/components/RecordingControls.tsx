import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Square, Play, Save, RotateCcw } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  hasRecording: boolean;
  isPlaying: boolean;
  isAuthenticated: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
  onSaveRecording: () => void;
  onClearRecording: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  hasRecording,
  isPlaying,
  isAuthenticated,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onSaveRecording,
  onClearRecording
}) => {
  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-4 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {!isRecording ? (
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          whileTap={{ scale: 0.95 }}
          onClick={onStartRecording}
          disabled={isPlaying}
        >
          <Disc size={18} />
          <span>Record</span>
        </motion.button>
      ) : (
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
          whileTap={{ scale: 0.95 }}
          onClick={onStopRecording}
        >
          <Square size={18} />
          <span>Stop</span>
        </motion.button>
      )}

      {hasRecording && (
        <>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={onPlayRecording}
            disabled={isRecording || isPlaying}
          >
            <Play size={18} />
            <span>Play</span>
          </motion.button>
          
          {isAuthenticated && (
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={onSaveRecording}
              disabled={isRecording || isPlaying}
            >
              <Save size={18} />
              <span>Save</span>
            </motion.button>
          )}
          
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={onClearRecording}
            disabled={isRecording || isPlaying}
          >
            <RotateCcw size={18} />
            <span>Clear</span>
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default RecordingControls;