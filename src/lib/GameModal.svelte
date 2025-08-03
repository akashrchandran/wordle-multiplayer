<script lang="ts">
  import { gameStats, resetGame, type GameStatus } from '../lib/gameStore.js';
  
  export let isOpen: boolean = false;
  export let gameStatus: GameStatus;
  export let targetWord: string;
  export let currentRow: number;
  
  function closeModal(): void {
    isOpen = false;
  }
  
  function playAgain(): void {
    resetGame();
    closeModal();
  }
  
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
  
  $: winPercentage = $gameStats.gamesPlayed > 0 
    ? Math.round(($gameStats.gamesWon / $gameStats.gamesPlayed) * 100) 
    : 0;
    
  $: maxGuessCount = Math.max(...Object.values($gameStats.guessDistribution));
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={closeModal} on:keydown={handleKeydown} role="button" tabindex="0" aria-label="Close modal">
    <div class="modal" on:click|stopPropagation on:keydown|stopPropagation role="dialog" tabindex="-1" aria-modal="true">
      <div class="modal-header">
        <h2>
          {#if gameStatus === 'won'}
            Magnificent!
          {:else}
            Better luck next time!
          {/if}
        </h2>
        <button class="close-button" on:click={closeModal}>&times;</button>
      </div>
      
      <div class="modal-content">
        {#if gameStatus === 'lost'}
          <p class="answer">The word was: <strong>{targetWord}</strong></p>
        {/if}
        
        <div class="stats">
          <h3>Statistics</h3>
          <div class="stats-grid">
            <div class="stat">
              <div class="stat-number">{$gameStats.gamesPlayed}</div>
              <div class="stat-label">Played</div>
            </div>
            <div class="stat">
              <div class="stat-number">{winPercentage}</div>
              <div class="stat-label">Win %</div>
            </div>
            <div class="stat">
              <div class="stat-number">{$gameStats.currentStreak}</div>
              <div class="stat-label">Current Streak</div>
            </div>
            <div class="stat">
              <div class="stat-number">{$gameStats.maxStreak}</div>
              <div class="stat-label">Max Streak</div>
            </div>
          </div>
          
          <div class="guess-distribution">
            <h4>Guess Distribution</h4>
            {#each Object.entries($gameStats.guessDistribution) as [guessNumber, count]}
              <div class="distribution-row">
                <div class="guess-number">{guessNumber}</div>
                <div class="distribution-bar">
                  <div 
                    class="bar-fill" 
                    class:current-game={gameStatus === 'won' && parseInt(guessNumber) === currentRow}
                    style="width: {maxGuessCount > 0 ? (count / maxGuessCount) * 100 : 0}%"
                  >
                    {count}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="play-again-btn" on:click={playAgain}>
            Play Again
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background: var(--modal-bg);
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: slideIn 0.3s ease-out;
    transition: background-color 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
  }
  
  .modal-header h2 {
    margin: 0;
    color: var(--modal-text);
    font-size: 1.5rem;
    transition: color 0.3s ease;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--modal-text-muted);
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: color 0.3s ease;
  }
  
  .close-button:hover {
    color: var(--modal-text);
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .answer {
    text-align: center;
    font-size: 1.1rem;
    margin-bottom: 20px;
    color: var(--modal-text);
  }
  
  .answer strong {
    color: #6aaa64;
    font-weight: bold;
  }
  
  .stats h3 {
    margin-top: 0;
    margin-bottom: 15px;
    text-align: center;
    color: var(--modal-text);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: var(--modal-text);
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: var(--modal-text-muted);
    text-transform: uppercase;
  }
  
  .guess-distribution h4 {
    margin-bottom: 15px;
    color: var(--modal-text);
  }
  
  .distribution-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  
  .guess-number {
    font-weight: bold;
    margin-right: 10px;
    min-width: 10px;
    color: var(--modal-text);
  }
  
  .distribution-bar {
    flex: 1;
    height: 20px;
    background-color: var(--border-color);
    position: relative;
  }
  
  .bar-fill {
    height: 100%;
    background-color: #787c7e;
    color: white;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 5px;
    font-size: 12px;
    font-weight: bold;
    min-width: 7%;
  }
  
  .bar-fill.current-game {
    background-color: #6aaa64;
  }
  
  .modal-actions {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  
  .play-again-btn {
    background-color: #6aaa64;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .play-again-btn:hover {
    background-color: #5a9a54;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .modal {
      width: 95%;
    }
    
    .modal-header {
      padding: 15px;
    }
    
    .modal-content {
      padding: 15px;
    }
    
    .stats-grid {
      gap: 8px;
    }
    
    .stat-number {
      font-size: 1.5rem;
    }
  }
</style>
