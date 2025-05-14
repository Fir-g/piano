import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Play, Trash, Share2, ArrowLeft } from 'lucide-react';
import { Melody } from '../types';
import { playNote } from '../utils/pianoUtils';

const MelodiesPage: React.FC = () => {
  const [melodies, setMelodies] = useState<Melody[]>([]);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from API
    const mockMelodies: Melody[] = [
      {
        _id: '1',
        name: 'My First Song',
        notes: [
          { key: 'C4', time: 0 },
          { key: 'E4', time: 300 },
          { key: 'G4', time: 600 },
          { key: 'C5', time: 900 }
        ],
        isPublic: true,
        createdAt: '2023-05-15T12:30:00Z'
      },
      {
        _id: '2',
        name: 'Funky Tune',
        notes: [
          { key: 'F4', time: 0 },
          { key: 'A4', time: 250 },
          { key: 'C5', time: 500 },
          { key: 'F5', time: 750 }
        ],
        isPublic: false,
        createdAt: '2023-05-20T15:45:00Z'
      }
    ];
    
    setMelodies(mockMelodies);
  }, []);

  const playMelody = async (melodyId: string) => {
    const melody = melodies.find(m => m._id === melodyId);
    if (!melody) return;
    
    setIsPlaying(melodyId);
    
    let lastTime = 0;
    
    for (let i = 0; i < melody.notes.length; i++) {
      const { key, time } = melody.notes[i];
      const waitTime = i === 0 ? 0 : time - lastTime;
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      const [note, octave] = [key.slice(0, -1), parseInt(key.slice(-1))];
      playNote(note, octave);
      
      lastTime = time;
    }
    
    setIsPlaying(null);
  };

  const deleteMelody = (melodyId: string) => {
    // In a real app, this would call API
    setMelodies(prev => prev.filter(m => m._id !== melodyId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (melodies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <Music size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Melodies Yet</h2>
          <p className="text-gray-600 mb-6">You haven't saved any melodies. Start playing and recording to create your collection!</p>
          <Link 
            to="/"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go to Piano
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Melodies</h1>
          <Link 
            to="/"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Piano
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {melodies.map((melody) => (
            <motion.div
              key={melody._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{melody.name}</h2>
                    <p className="text-sm text-gray-500">{formatDate(melody.createdAt || '')}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {melody.isPublic && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Public
                      </span>
                    )}
                    {!melody.isPublic && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Private
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex mt-2 mb-4 overflow-x-auto">
                  <div className="flex space-x-1.5 py-2">
                    {melody.notes.slice(0, 8).map((note, index) => (
                      <div 
                        key={index}
                        className={`
                          min-w-8 h-8 flex items-center justify-center rounded-md text-xs
                          ${note.key.includes('#') ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}
                        `}
                      >
                        {note.key}
                      </div>
                    ))}
                    {melody.notes.length > 8 && (
                      <div className="min-w-8 h-8 flex items-center justify-center text-xs text-gray-500">
                        +{melody.notes.length - 8} more
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => playMelody(melody._id || '')}
                    disabled={isPlaying !== null}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isPlaying === melody._id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Playing...
                      </>
                    ) : (
                      <>
                        <Play size={16} className="mr-1.5" />
                        Play
                      </>
                    )}
                  </button>
                  
                  <div className="flex space-x-2">
                    {melody.isPublic && (
                      <button
                        className="inline-flex items-center p-1.5 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                        title="Share melody"
                      >
                        <Share2 size={18} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteMelody(melody._id || '')}
                      className="inline-flex items-center p-1.5 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                      title="Delete melody"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MelodiesPage;