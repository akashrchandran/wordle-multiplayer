<script lang="ts">
  import Header from './lib/Header.svelte';
  import GameBoard from './lib/GameBoard.svelte';
  import Keyboard from './lib/Keyboard.svelte';
  import GameModal from './lib/GameModal.svelte';
  import Toast from './lib/Toast.svelte';
  import { gameStatus, targetWord, currentRow, isGameOver, theme } from './lib/gameStore.js';
  
  let showModal: boolean = false;
  
  // Show modal when game ends
  $: if ($isGameOver && !showModal) {
    setTimeout(() => {
      showModal = true;
    }, 2500); // Delay to show tile animations first (cascade + animation time)
  }
  
  // Reset modal when game status changes to playing
  $: if ($gameStatus === 'playing') {
    showModal = false;
  }
</script>

<div class="app" data-theme={$theme}>
  <Header bind:showModal />
  
  <main class="game-container">
    <div class="game-content">
      <GameBoard />
      <Keyboard gameStatus={$gameStatus} />
    </div>
  </main>
  
  <GameModal 
    bind:isOpen={showModal} 
    gameStatus={$gameStatus} 
    targetWord={$targetWord}
    currentRow={$currentRow}
  />
  
  <Toast />
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    height: 100%;
    overflow-x: hidden;
  }
  
  :global(*) {
    box-sizing: border-box;
  }

  :global([data-theme="light"]) {
    --bg-color: #ffffff;
    --text-color: #1a1a1b;
    --border-color: #d3d6da;
    --tile-border: #d3d6da;
    --tile-border-filled: #878a8c;
    --header-bg: #ffffff;
    --button-hover-bg: #f5f5f5;
    --button-text: #878a8c;
    --button-text-hover: #1a1a1b;
    --modal-bg: #ffffff;
    --modal-text: #1a1a1b;
    --modal-text-muted: #666;
    --toast-bg: #1a1a1b;
    --toast-text: #ffffff;
  }

  :global([data-theme="dark"]) {
    --bg-color: #121213;
    --text-color: #ffffff;
    --border-color: #3a3a3c;
    --tile-border: #3a3a3c;
    --tile-border-filled: #565758;
    --header-bg: #121213;
    --button-hover-bg: #3a3a3c;
    --button-text: #818384;
    --button-text-hover: #ffffff;
    --modal-bg: #121213;
    --modal-text: #ffffff;
    --modal-text-muted: #a1a1a1;
    --toast-bg: #ffffff;
    --toast-text: #121213;
  }
  
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .game-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 500px;
    margin: 0 auto;
    padding: 0 16px;
  }
  
  .game-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: calc(100vh - 60px);
    padding: 20px 0;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 480px) {

  }
  
  @media (min-height: 700px) {
    .game-container {
      padding: 0 0;
      margin: 0 0;
    }
  }
</style>
