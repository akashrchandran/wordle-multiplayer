import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { getRandomWord, isValidWord } from './words.js';

// Type definitions
export type GameStatus = 'playing' | 'won' | 'lost';
export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface GuessResult {
  word: string;
  result: LetterStatus[];
}

export interface GameStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
}

export interface KeyboardState {
  [key: string]: LetterStatus;
}

// Game constants
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

// Game state stores
export const targetWord: Writable<string> = writable(getRandomWord());
export const currentGuess: Writable<string> = writable('');
export const guesses: Writable<GuessResult[]> = writable([]);
export const currentRow: Writable<number> = writable(0);
export const gameStatus: Writable<GameStatus> = writable('playing');
export const lastGuessResult: Writable<LetterStatus[] | null> = writable(null);
export const showInvalidWord: Writable<boolean> = writable(false);

// Keyboard state
export const keyboardState: Writable<KeyboardState> = writable({});

// Theme state
export type Theme = 'light' | 'dark';
export const theme: Writable<Theme> = writable('light');

// Game statistics
export const gameStats: Writable<GameStatistics> = writable({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
});

// Load stats and theme from localStorage
if (typeof window !== 'undefined') {
  const savedStats = localStorage.getItem('wordle-stats');
  if (savedStats) {
    gameStats.set(JSON.parse(savedStats));
  }
  
  const savedTheme = localStorage.getItem('wordle-theme') as Theme;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    theme.set(savedTheme);
  }
}

// Derived stores
export const isGameOver: Readable<boolean> = derived(gameStatus, ($status: GameStatus) => $status !== 'playing');

// Game actions
export function addLetter(letter: string): void {
  currentGuess.update((guess: string) => {
    if (guess.length < WORD_LENGTH) {
      return guess + letter.toUpperCase();
    }
    return guess;
  });
}

export function removeLetter(): void {
  currentGuess.update((guess: string) => guess.slice(0, -1));
}

export function submitGuess(): Promise<boolean> {
  return new Promise((resolve) => {
    currentGuess.subscribe((guess: string) => {
      if (guess.length !== WORD_LENGTH) {
        resolve(false);
        return;
      }

      if (!isValidWord(guess)) {
        showInvalidWord.set(true);
        setTimeout(() => showInvalidWord.set(false), 2000);
        resolve(false);
        return;
      }

      targetWord.subscribe((target: string) => {
        const result = evaluateGuess(guess, target);
        
        guesses.update((prev: GuessResult[]) => [...prev, { word: guess, result }]);
        
        // Set the result first for the flip animation
        lastGuessResult.set(result);
        
        // Update keyboard state
        updateKeyboardState(guess, result);
        
        currentRow.update((row: number) => row + 1);
        currentGuess.set('');
        
        // Check win condition after a delay to let the animation play
        setTimeout(() => {
          if (guess === target) {
            gameStatus.set('won');
            updateStats(true);
          } else {
            currentRow.subscribe((row: number) => {
              if (row >= MAX_ATTEMPTS) {
                gameStatus.set('lost');
                updateStats(false);
              }
            })();
          }
          
          // Clear the last guess result after animation completes
          setTimeout(() => {
            lastGuessResult.set(null);
          }, 100);
        }, 2000); // Wait for flip animation cascade to complete (200ms * 4 delays + 1200ms animation)
        
        resolve(true);
      })();
    })();
  });
}

function evaluateGuess(guess: string, target: string): LetterStatus[] {
  const result: LetterStatus[] = new Array(WORD_LENGTH);
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  
  // First pass: mark correct positions
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = 'correct';
      targetLetters[i] = ''; // Mark as used
      guessLetters[i] = '';
    }
  }
  
  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessLetters[i] !== '') {
      const targetIndex = targetLetters.indexOf(guessLetters[i]);
      if (targetIndex !== -1) {
        result[i] = 'present';
        targetLetters[targetIndex] = ''; // Mark as used
      } else {
        result[i] = 'absent';
      }
    }
  }
  
  return result;
}

function updateKeyboardState(guess: string, result: LetterStatus[]): void {
  keyboardState.update((state: KeyboardState) => {
    const newState = { ...state };
    
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i];
      const status = result[i];
      
      // Don't downgrade a correct letter to present or absent
      if (newState[letter] === 'correct') continue;
      
      // Don't downgrade a present letter to absent
      if (newState[letter] === 'present' && status === 'absent') continue;
      
      newState[letter] = status;
    }
    
    return newState;
  });
}

function updateStats(won: boolean): void {
  gameStats.update((stats: GameStatistics) => {
    const newStats: GameStatistics = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: won ? stats.gamesWon + 1 : stats.gamesWon
    };
    
    if (won) {
      newStats.currentStreak = stats.currentStreak + 1;
      newStats.maxStreak = Math.max(stats.maxStreak, newStats.currentStreak);
      
      // Update guess distribution
      currentRow.subscribe((row: number) => {
        newStats.guessDistribution = {
          ...stats.guessDistribution,
          [row]: stats.guessDistribution[row] + 1
        };
      })();
    } else {
      newStats.currentStreak = 0;
    }
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordle-stats', JSON.stringify(newStats));
    }
    
    return newStats;
  });
}

export function resetGame(): void {
  targetWord.set(getRandomWord());
  currentGuess.set('');
  guesses.set([]);
  currentRow.set(0);
  gameStatus.set('playing');
  lastGuessResult.set(null);
  keyboardState.set({});
  showInvalidWord.set(false);
}

export interface GameState {
  targetWord: string;
  currentGuess: string;
  guesses: GuessResult[];
  currentRow: number;
  gameStatus: GameStatus;
  keyboardState: KeyboardState;
}

export function getGameState(): GameState {
  let state: Partial<GameState> = {};
  
  targetWord.subscribe((word: string) => state.targetWord = word)();
  currentGuess.subscribe((guess: string) => state.currentGuess = guess)();
  guesses.subscribe((g: GuessResult[]) => state.guesses = g)();
  currentRow.subscribe((row: number) => state.currentRow = row)();
  gameStatus.subscribe((status: GameStatus) => state.gameStatus = status)();
  keyboardState.subscribe((kb: KeyboardState) => state.keyboardState = kb)();
  
  return state as GameState;
}

export function toggleTheme(): void {
  theme.update((currentTheme: Theme) => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordle-theme', newTheme);
    }
    
    return newTheme;
  });
}
