<script lang="ts">
  import { toggleTheme, theme } from '../lib/gameStore.js';
  
  export let showModal: boolean = false;
  
  function handleThemeToggle(): void {
    toggleTheme();
  }
  
  function handleStats(): void {
    showModal = true;
  }
</script>

<header class="game-header">
  <div class="header-content">
    <button class="icon-button" on:click={handleThemeToggle} title="Toggle Theme" aria-label="Toggle theme">
      {#if $theme === 'light'}
        <!-- Moon icon for dark mode -->
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
      {:else}
        <!-- Sun icon for light mode -->
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
        </svg>
      {/if}
    </button>
    
    <h1 class="title">Wordle</h1>
    
    <button class="icon-button" on:click={handleStats} title="Statistics" aria-label="View statistics">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
      </svg>
    </button>
  </div>
  
  <div class="divider"></div>
</header>

<style>
  .game-header {
    background-color: var(--header-bg);
    border-bottom: 1px solid var(--border-color);
    padding: 0 16px;
    position: sticky;
    top: 0;
    z-index: 100;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 500px;
    margin: 0 auto;
    height: 60px;
  }
  
  .title {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
    text-align: center;
    letter-spacing: 0.01em;
    transition: color 0.3s ease;
  }
  
  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    color: var(--button-text);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon-button:hover {
    background-color: var(--button-hover-bg);
    color: var(--button-text-hover);
  }
  
  .icon-button:active {
    transform: scale(0.95);
  }
  
  .divider {
    height: 1px;
    background-color: var(--border-color);
    margin: 0 -16px;
    transition: background-color 0.3s ease;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .game-header {
      padding: 0 12px;
    }
    
    .header-content {
      height: 50px;
    }
    
    .title {
      font-size: 1.8rem;
    }
    
    .icon-button {
      padding: 6px;
    }
  }
</style>
