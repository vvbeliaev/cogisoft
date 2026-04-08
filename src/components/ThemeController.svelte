<script module>
  const LIGHT_THEME = "LIGHT";
  const DARK_THEME = "DARK";

  let selectedDark = $state(false);
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import Sun from "~icons/ph/sun-duotone";
  import Moon from "~icons/ph/moon-duotone";

  interface Props {
    expanded?: boolean;
  }

  const { expanded = false }: Props = $props();

  const themeLabel = $derived(selectedDark ? "Dark mode" : "Light mode");

  onMount(() => {
    const theme = localStorage.getItem("theme");
    selectedDark = theme === DARK_THEME;
  });

  $effect(() => {
    const nextTheme = selectedDark ? DARK_THEME : LIGHT_THEME;
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  });

  function toggle() {
    selectedDark = !selectedDark;
  }
</script>

{#if expanded}
  <button
    type="button"
    onclick={toggle}
    class="flex w-full items-center gap-3 rounded-none px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
    aria-label={themeLabel}
  >
    {#if selectedDark}
      <Moon class="size-4 shrink-0" />
    {:else}
      <Sun class="size-4 shrink-0" />
    {/if}
    <span>{themeLabel}</span>
  </button>
{:else}
  <button
    type="button"
    onclick={toggle}
    class="inline-flex size-9 items-center justify-center rounded-none text-foreground transition-colors hover:bg-muted"
    aria-label={themeLabel}
    title={themeLabel}
  >
    {#if selectedDark}
      <Moon class="size-5" />
    {:else}
      <Sun class="size-5" />
    {/if}
  </button>
{/if}
