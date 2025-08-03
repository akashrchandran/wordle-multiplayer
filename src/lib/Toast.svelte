<script lang="ts">
  import { showInvalidWord } from '../lib/gameStore.js';
  
  export let message: string = '';
  export let show: boolean = false;
  export let type: 'info' | 'success' | 'error' = 'info';
  
  $: if ($showInvalidWord) {
    showToast('Not in word list', 'error');
  }
  
  function showToast(msg: string, toastType: 'info' | 'success' | 'error' = 'info'): void {
    message = msg;
    type = toastType;
    show = true;
    
    setTimeout(() => {
      show = false;
    }, 2000);
  }
  
  // Export the showToast function so parent components can use it
  export { showToast };
</script>

{#if show}
  <div class="toast" class:success={type === 'success'} class:error={type === 'error'}>
    {message}
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--toast-bg);
    color: var(--toast-text);
    padding: 12px 20px;
    border-radius: 4px;
    font-weight: 600;
    z-index: 1000;
    animation: slideDown 0.3s ease-out, fadeOut 0.3s ease-in 1.7s forwards;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .toast.success {
    background-color: #6aaa64;
  }
  
  .toast.error {
    background-color: #e74c3c;
  }
  
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .toast {
      top: 80px;
      font-size: 0.9rem;
      padding: 10px 16px;
    }
  }
</style>
