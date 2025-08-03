<script lang="ts">
  import { addLetter, removeLetter, submitGuess, keyboardState, type GameStatus } from '../lib/gameStore.js';
  
  export let gameStatus: GameStatus;
  
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];
  
  async function handleKeyPress(key: string): Promise<void> {
    if (gameStatus !== 'playing') return;
    
    if (key === 'ENTER') {
      await submitGuess();
    } else if (key === 'BACKSPACE') {
      removeLetter();
    } else {
      addLetter(key);
    }
  }
  
  function getKeyStatus(key: string): string {
    return $keyboardState[key] || 'unknown';
  }
</script>

<div class="keyboard">
  {#each keyboardRows as row}
    <div class="keyboard-row">
      {#each row as key}
        <button
          class="key"
          class:special={key === 'ENTER' || key === 'BACKSPACE'}
          class:correct={getKeyStatus(key) === 'correct'}
          class:present={getKeyStatus(key) === 'present'}
          class:absent={getKeyStatus(key) === 'absent'}
          disabled={gameStatus !== 'playing'}
          on:click={() => handleKeyPress(key)}
        >
          {#if key === 'BACKSPACE'}
            <svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor">
              <path d="M7.5 2L2 8l5.5 6H18V2H7.5zM15 5.5L13.5 7L15 8.5L13.5 10L12 8.5L10.5 10L9 8.5L10.5 7L9 5.5L10.5 4L12 5.5L13.5 4L15 5.5z"/>
            </svg>
          {:else}
            {key}
          {/if}
        </button>
      {/each}
    </div>
  {/each}
</div>

<svelte:window on:keydown={(e) => {
  if (gameStatus !== 'playing') return;
  
  const key = e.key.toUpperCase();
  
  if (key === 'ENTER') {
    e.preventDefault();
    handleKeyPress('ENTER');
  } else if (key === 'BACKSPACE') {
    e.preventDefault();
    handleKeyPress('BACKSPACE');
  } else if (/^[A-Z]$/.test(key)) {
    e.preventDefault();
    handleKeyPress(key);
  }
}} />

<style>
  .keyboard {
    max-width: 100%;
    padding: 20px 10px;
  }
  
  .keyboard-row {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
    gap: 6px;
  }
  
  .key {
    min-width: 43px;
    height: 58px;
    border: none;
    border-radius: 4px;
    background-color: var(--tile-border);
    color: var(--text-color);
    font-size: 13px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease;
  }
  
  .key:hover:not(:disabled) {
    background-color: var(--tile-border-filled);
  }
  
  .key:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  .key:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .key.special {
    min-width: 65px;
    font-size: 12px;
  }
  
  .key.correct {
    background-color: #6aaa64;
    color: white;
  }
  
  .key.present {
    background-color: #c9b458;
    color: white;
  }
  
  .key.absent {
    background-color: #787c7e;
    color: white;
  }
  
  .key.correct:hover:not(:disabled) {
    background-color: #5a9a54;
  }
  
  .key.present:hover:not(:disabled) {
    background-color: #b9a448;
  }
  
  .key.absent:hover:not(:disabled) {
    background-color: #686c6e;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .keyboard {
      padding: 15px 8px;
      max-width: 100%;
      width: 100%;
    }
    
    .keyboard-row {
      gap: 3px;
      margin-bottom: 6px;
    }
    
    .key {
      flex: 1;
      min-width: 0;
      height: 52px;
      font-size: 12px;
    }
    
    .key.special {
      flex: 1.5;
      font-size: 10px;
    }
  }
  
  @media (max-width: 360px) {
    .keyboard {
      padding: 12px 5px;
    }
    
    .key {
      height: 48px;
      font-size: 11px;
    }
    
    .key.special {
      font-size: 9px;
    }
    
    .keyboard-row {
      gap: 2px;
      margin-bottom: 5px;
    }
  }
</style>
