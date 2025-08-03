<script lang="ts">
  import { currentGuess, guesses, currentRow, showInvalidWord, lastGuessResult, WORD_LENGTH, MAX_ATTEMPTS } from '../lib/gameStore.js';
  
  let flipAnimationKey = 0;
  
  // Trigger flip animation when a new guess is submitted
  $: if ($lastGuessResult) {
    flipAnimationKey++;
  }
  
  // Create a 6x5 grid for the game board
  $: board = Array(MAX_ATTEMPTS).fill(null).map((_, rowIndex) => {
    if (rowIndex < $guesses.length) {
      // Completed guess
      const shouldFlip = rowIndex === $guesses.length - 1 && $lastGuessResult;
      return $guesses[rowIndex].word.split('').map((letter, colIndex) => ({
        letter,
        status: $guesses[rowIndex].result[colIndex],
        shouldFlip,
        flipDelay: colIndex * 200 // 200ms delay between each tile for more visible cascade
      }));
    } else if (rowIndex === $currentRow && $currentGuess) {
      // Current guess in progress
      const currentLetters = $currentGuess.split('');
      return Array(WORD_LENGTH).fill(null).map((_, colIndex) => ({
        letter: currentLetters[colIndex] || '',
        status: 'empty',
        shouldFlip: false,
        flipDelay: 0
      }));
    } else {
      // Empty row
      return Array(WORD_LENGTH).fill(null).map(() => ({
        letter: '',
        status: 'empty',
        shouldFlip: false,
        flipDelay: 0
      }));
    }
  });
</script>

<div class="game-board" class:shake={$showInvalidWord}>
  {#each board as row, rowIndex}
    <div class="board-row">
      {#each row as cell, colIndex}
        <div 
          class="tile"
          class:filled={cell.letter !== ''}
          class:correct={cell.status === 'correct'}
          class:present={cell.status === 'present'}
          class:absent={cell.status === 'absent'}
          class:flip={cell.shouldFlip}
          style="--flip-delay: {cell.flipDelay}ms"
        >
          <div class="tile-inner">
            <div class="tile-front">
              {cell.letter}
            </div>
            <div class="tile-back"
                 class:correct={cell.status === 'correct'}
                 class:present={cell.status === 'present'}
                 class:absent={cell.status === 'absent'}>
              {cell.letter}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .game-board {
    display: grid;
    grid-template-rows: repeat(6, 1fr);
    gap: 5px;
    padding: 10px;
    max-width: 350px;
    margin: 0 auto;
  }
  
  .board-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
  }
  
  .tile {
    width: 62px;
    height: 62px;
    position: relative;
    font-size: 2rem;
    font-weight: bold;
    text-transform: uppercase;
    user-select: none;
    perspective: 1000px;
    border-radius: 2px;
  }
  
  .tile-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transform-style: preserve-3d;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .tile.flip .tile-inner {
    animation: flipTile 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: var(--flip-delay);
  }
  
  @keyframes flipTile {
    0% {
      transform: rotateY(0deg);
    }
    50% {
      transform: rotateY(90deg);
    }
    100% {
      transform: rotateY(180deg);
    }
  }
  
  .tile-front, .tile-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
    border: 2px solid var(--tile-border);
    box-sizing: border-box;
  }
  
  .tile-front {
    transform: rotateY(0deg);
  }
  
  .tile-back {
    transform: rotateY(180deg);
  }
  
  .tile.filled .tile-front {
    border-color: var(--tile-border-filled);
  }
  
  .tile.filled {
    animation: pop 0.1s ease-in-out;
  }
  
  .tile.correct .tile-back {
    background-color: #6aaa64 !important;
    border-color: #6aaa64;
    color: white;
  }
  
  .tile.present .tile-back {
    background-color: #c9b458 !important;
    border-color: #c9b458;
    color: white;
  }
  
  .tile.absent .tile-back {
    background-color: #787c7e !important;
    border-color: #787c7e;
    color: white;
  }
  
  /* Ensure the entire tile shows the correct color after flipping */
  .tile.correct:not(.flip) {
    background-color: #6aaa64;
    border: 2px solid #6aaa64;
    color: white;
  }
  
  .tile.present:not(.flip) {
    background-color: #c9b458;
    border: 2px solid #c9b458;
    color: white;
  }
  
  .tile.absent:not(.flip) {
    background-color: #787c7e;
    border: 2px solid #787c7e;
    color: white;
  }
  
  /* Also style the front faces of completed tiles */
  .tile.correct:not(.flip) .tile-front {
    background-color: #6aaa64;
    border-color: #6aaa64;
    color: white;
  }
  
  .tile.present:not(.flip) .tile-front {
    background-color: #c9b458;
    border-color: #c9b458;
    color: white;
  }
  
  .tile.absent:not(.flip) .tile-front {
    background-color: #787c7e;
    border-color: #787c7e;
    color: white;
  }
  
  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .shake {
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .tile {
      width: 52px;
      height: 52px;
      font-size: 1.6rem;
    }
    
    .game-board {
      max-width: 300px;
    }
  }
</style>
