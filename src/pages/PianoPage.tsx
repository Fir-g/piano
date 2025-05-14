import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Piano from '../components/Piano';
import RecordingControls from '../components/RecordingControls';
import SaveMelodyModal from '../components/SaveMelodyModal';
import { useAuth } from '../context/AuthContext';
import { Note, Melody } from '../types';
import { LockIcon, UnlockIcon, Music } from 'lucide-react';
import { playNote } from '../utils/pianoUtils';
import { supabase } from '../lib/supabase';

const PianoPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<Note[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleNotePlay = useCallback((note: string) => {
    if (isRecording && recordingStartTime) {
      const time = Date.now() - recordingStartTime;
      setRecordedNotes(prev => [...prev, { key: note, time }]);
    }
  }, [isRecording, recordingStartTime]);

  const startRecording = () => {
    setRecordedNotes([]);
    setRecordingStartTime(Date.now());
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingStartTime(null);
  };

  const playRecording = async () => {
    if (recordedNotes.length === 0) return;
    
    setIsPlaying(true);
    
    let lastTime = 0;
    
    for (let i = 0; i < recordedNotes.length; i++) {
      const { key, time } = recordedNotes[i];
      const waitTime = i === 0 ? 0 : time - lastTime;
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      const [note, octave] = [key.slice(0, -1), parseInt(key.slice(-1))];
      playNote(note, octave);
      
      lastTime = time;
    }
    
    setIsPlaying(false);
  };

  const clearRecording = () => {
    setRecordedNotes([]);
  };

  const handleSaveMelody = async (name: string, isPublic: boolean) => {
    try {
      const { data, error } = await supabase
        .from('melodies')
        .insert({
          name,
          notes: recordedNotes,
          is_public: isPublic,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setShowSaveModal(false);
      navigate('/melodies');
    } catch (error: any) {
      console.error('Error saving melody:', error.message);
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Music size={28} className="mr-2 text-indigo-600" />
            Virtual Piano
          </h1>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center text-green-600">
                <UnlockIcon size={18} className="mr-1" />
                <span className="text-sm">Signed In</span>
              </div>
            ) : (
              <button 
                className="flex items-center text-gray-600 hover:text-indigo-600"
                onClick={() => navigate('/login')}
              >
                <LockIcon size={18} className="mr-1" />
                <span className="text-sm">Sign In to Save</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <RecordingControls 
            isRecording={isRecording}
            hasRecording={recordedNotes.length > 0}
            isPlaying={isPlaying}
            isAuthenticated={isAuthenticated}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onPlayRecording={playRecording}
            onSaveRecording={() => setShowSaveModal(true)}
            onClearRecording={clearRecording}
          />
          
          <Piano 
            octaves={2} 
            startOctave={3} 
            isRecording={isRecording} 
            onNotePlay={handleNotePlay} 
          />
        </div>

        {recordedNotes.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Recorded Melody</h2>
            <div className="overflow-x-auto">
              <div className="flex space-x-2 py-2">
                {recordedNotes.map((note, index) => (
                  <div 
                    key={index}
                    className={`
                      h-10 min-w-10 flex items-center justify-center rounded-md 
                      ${note.key.includes('#') ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}
                    `}
                  >
                    {note.key}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              {recordedNotes.length} notes recorded{' '}
              {!isAuthenticated && (
                <span>
                  - <button className="text-indigo-600 hover:underline" onClick={() => navigate('/login')}>Sign in</button> to save
                </span>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      <SaveMelodyModal 
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveMelody}
      />
    </motion.div>
  );
};

export default PianoPage;