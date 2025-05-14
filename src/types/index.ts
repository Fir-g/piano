export interface Piano {
  octaves: number;
  startOctave: number;
}

export interface PianoKey {
  note: string;
  octave: number;
  isBlack: boolean;
  keyboardKey?: string;
}

export interface Note {
  key: string;
  time: number;
}

export interface Melody {
  id?: string;
  name: string;
  notes: Note[];
  is_public: boolean;
  created_at?: string;
  user_id?: string;
}

export interface Profile {
  id: string;
  email: string;
  created_at?: string;
}

export interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
}