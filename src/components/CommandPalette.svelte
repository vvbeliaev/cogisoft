<!--
  CommandPalette — Raycast × Cogito ⌘K palette.
  Built on bits-ui Dialog + Command primitives; fully custom-styled.
-->
<script lang="ts">
  import { Dialog as DialogPrimitive, Command as CommandPrimitive } from "bits-ui";
  import House from "~icons/ph/house-duotone";
  import User from "~icons/ph/user-duotone";
  import Rocket from "~icons/ph/rocket-launch-duotone";
  import Flask from "~icons/ph/flask-duotone";
  import BookOpen from "~icons/ph/book-open-duotone";
  import Handshake from "~icons/ph/handshake-duotone";
  import Envelope from "~icons/ph/envelope-duotone";
  import Calendar from "~icons/ph/calendar-duotone";
  import MagnifyingGlass from "~icons/ph/magnifying-glass";
  import ArrowUpRight from "~icons/ph/arrow-up-right";

  type Entry = {
    label: string;
    href: string;
    group: "Navigate" | "Action";
    icon: typeof House;
    external?: boolean;
  };

  const entries: Entry[] = [
    { group: "Navigate", label: "Home", href: "/", icon: House },
    { group: "Navigate", label: "About", href: "/about", icon: User },
    { group: "Navigate", label: "Custom Solution", href: "/custom-solution", icon: Rocket },
    { group: "Navigate", label: "Labs", href: "/labs", icon: Flask },
    { group: "Navigate", label: "Blog", href: "/blog", icon: BookOpen },
    { group: "Navigate", label: "Partnership", href: "/partnership", icon: Handshake },
    { group: "Action", label: "Contact me", href: "/contact", icon: Envelope },
    {
      group: "Action",
      label: "Book a call",
      href: "https://cal.com/vvbeliaev/30min",
      icon: Calendar,
      external: true,
    },
  ];

  const navigateEntries = entries.filter((e) => e.group === "Navigate");
  const actionEntries = entries.filter((e) => e.group === "Action");

  let open = $state(false);
  let query = $state("");

  // Reset search when palette closes
  $effect(() => {
    if (!open) query = "";
  });

  function toggle(next: boolean) {
    open = next;
  }

  function handleKey(event: KeyboardEvent) {
    const cmd = event.metaKey || event.ctrlKey;
    if (cmd && event.key.toLowerCase() === "k") {
      event.preventDefault();
      toggle(!open);
    }
  }

  function handleTriggerClick(event: Event) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-command-palette-trigger]")) {
      event.preventDefault();
      toggle(true);
    }
  }

  function handleCustomEvent() {
    toggle(true);
  }

  function runAction(entry: Entry) {
    open = false;
    if (entry.external) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = entry.href;
    }
  }

  $effect(() => {
    window.addEventListener("keydown", handleKey);
    window.addEventListener("cogito:open-palette", handleCustomEvent);
    document.addEventListener("click", handleTriggerClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("cogito:open-palette", handleCustomEvent);
      document.removeEventListener("click", handleTriggerClick);
    };
  });
</script>

<DialogPrimitive.Root bind:open>
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay class="cg-pal-overlay" />
    <DialogPrimitive.Content
      class="cg-pal-panel"
      aria-label="Cogito command palette"
    >
      <CommandPrimitive.Root loop class="cg-pal-root">
        <!-- Top accent stripe -->
        <div class="cg-pal-stripe" aria-hidden="true"></div>

        <!-- Search header -->
        <div class="cg-pal-header">
          <span class="cg-pal-search-icon" aria-hidden="true">
            <MagnifyingGlass class="w-[18px] h-[18px]" />
          </span>
          <CommandPrimitive.Input
            bind:value={query}
            class="cg-pal-input"
            placeholder="Search pages, actions…"
          />
          <button
            type="button"
            class="cg-pal-esc-btn"
            onclick={() => (open = false)}
            tabindex="-1"
            aria-label="Close palette"
          >
            <kbd class="kbd-cap" style="font-size:10px;height:20px;min-width:32px;">Esc</kbd>
          </button>
        </div>

        <!-- Results -->
        <CommandPrimitive.List class="cg-pal-list">
          <CommandPrimitive.Empty class="cg-pal-empty">
            No results found.
          </CommandPrimitive.Empty>

          <CommandPrimitive.Group class="cg-pal-group" value="navigate">
            <CommandPrimitive.GroupHeading class="cg-pal-group-label">
              Navigate
            </CommandPrimitive.GroupHeading>
            <CommandPrimitive.GroupItems>
              {#each navigateEntries as entry (entry.href)}
                <CommandPrimitive.Item
                  class="cg-pal-item"
                  value={entry.label}
                  onSelect={() => runAction(entry)}
                >
                  <span class="cg-pal-item-icon">
                    <entry.icon class="w-4 h-4" />
                  </span>
                  <span class="cg-pal-item-label">{entry.label}</span>
                </CommandPrimitive.Item>
              {/each}
            </CommandPrimitive.GroupItems>
          </CommandPrimitive.Group>

          <CommandPrimitive.Separator class="cg-pal-sep" />

          <CommandPrimitive.Group class="cg-pal-group" value="actions">
            <CommandPrimitive.GroupHeading class="cg-pal-group-label">
              Actions
            </CommandPrimitive.GroupHeading>
            <CommandPrimitive.GroupItems>
              {#each actionEntries as entry (entry.href)}
                <CommandPrimitive.Item
                  class="cg-pal-item"
                  value={entry.label}
                  onSelect={() => runAction(entry)}
                >
                  <span class="cg-pal-item-icon">
                    <entry.icon class="w-4 h-4" />
                  </span>
                  <span class="cg-pal-item-label">{entry.label}</span>
                  {#if entry.external}
                    <span class="cg-pal-item-ext" aria-hidden="true">
                      <ArrowUpRight class="w-3.5 h-3.5" />
                    </span>
                  {/if}
                </CommandPrimitive.Item>
              {/each}
            </CommandPrimitive.GroupItems>
          </CommandPrimitive.Group>
        </CommandPrimitive.List>

        <!-- Footer -->
        <div class="cg-pal-footer">
          <span class="cg-pal-hint">
            <kbd class="cg-pal-key">↑↓</kbd>
            <span>navigate</span>
          </span>
          <span class="cg-pal-dot" aria-hidden="true">·</span>
          <span class="cg-pal-hint">
            <kbd class="cg-pal-key">↵</kbd>
            <span>open</span>
          </span>
          <span class="cg-pal-dot" aria-hidden="true">·</span>
          <span class="cg-pal-hint">
            <kbd class="cg-pal-key">esc</kbd>
            <span>close</span>
          </span>
          <span class="cg-pal-brand" aria-hidden="true">Cogito</span>
        </div>
      </CommandPrimitive.Root>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
</DialogPrimitive.Root>

<style>
  /* ── Keyframe animations ──────────────────────────────────────── */
  @keyframes pal-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pal-overlay-out {
    from { opacity: 1; }
    to   { opacity: 0; }
  }
  @keyframes pal-in {
    from {
      opacity: 0;
      transform: translate(-50%, calc(-50% + 12px)) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  @keyframes pal-out {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(-50%, calc(-50% + 6px)) scale(0.98);
    }
  }

  /* ── Overlay ─────────────────────────────────────────────────── */
  :global(.cg-pal-overlay) {
    position: fixed;
    inset: 0;
    z-index: 48;
    background: rgba(20, 20, 19, 0.42);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
  :global(.cg-pal-overlay[data-state="open"])  { animation: pal-overlay-in  180ms ease forwards; }
  :global(.cg-pal-overlay[data-state="closed"]) { animation: pal-overlay-out 140ms ease forwards; }
  :global([data-theme="DARK"] .cg-pal-overlay) { background: rgba(0, 0, 0, 0.62); }

  /* ── Panel ───────────────────────────────────────────────────── */
  :global(.cg-pal-panel) {
    position: fixed;
    top: 38%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    width: min(560px, calc(100vw - 2rem));
    background: #faf9f5;
    border: 1px solid rgba(20, 20, 19, 0.09);
    border-radius: 10px;
    overflow: hidden;
    outline: none;
    box-shadow:
      0 0 0 1px rgba(20, 20, 19, 0.03),
      0 2px 4px  rgba(20, 20, 19, 0.04),
      0 8px 16px rgba(20, 20, 19, 0.07),
      0 24px 48px rgba(20, 20, 19, 0.10),
      0 48px 80px rgba(20, 20, 19, 0.07);
  }
  :global(.cg-pal-panel[data-state="open"])   { animation: pal-in  200ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  :global(.cg-pal-panel[data-state="closed"]) { animation: pal-out 160ms cubic-bezier(0.4, 0, 1, 1) forwards; }

  :global([data-theme="DARK"] .cg-pal-panel) {
    background: #111213;
    border-color: rgba(255, 255, 255, 0.075);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.04),
      0 2px 4px  rgba(0, 0, 0, 0.20),
      0 8px 16px rgba(0, 0, 0, 0.35),
      0 24px 48px rgba(0, 0, 0, 0.45),
      0 1px 0   rgba(255, 255, 255, 0.04) inset;
  }

  /* ── Root ────────────────────────────────────────────────────── */
  :global(.cg-pal-root) {
    display: flex;
    flex-direction: column;
    background: transparent;
  }

  /* ── Top accent stripe ───────────────────────────────────────── */
  :global(.cg-pal-stripe) {
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(201, 100, 66, 0.5) 30%,
      rgba(217, 119, 87, 0.7) 50%,
      rgba(201, 100, 66, 0.5) 70%,
      transparent 100%
    );
    flex-shrink: 0;
  }

  /* ── Search header ───────────────────────────────────────────── */
  :global(.cg-pal-header) {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 54px;
    padding: 0 16px;
    border-bottom: 1px solid rgba(20, 20, 19, 0.07);
    flex-shrink: 0;
  }
  :global([data-theme="DARK"] .cg-pal-header) {
    border-bottom-color: rgba(255, 255, 255, 0.07);
  }

  :global(.cg-pal-search-icon) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: rgba(20, 20, 19, 0.32);
  }
  :global([data-theme="DARK"] .cg-pal-search-icon) {
    color: rgba(247, 248, 248, 0.3);
  }

  :global(.cg-pal-input) {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    font-family: var(--font-sans);
    font-size: 14px;
    font-weight: 400;
    color: var(--foreground);
    caret-color: var(--primary);
  }
  :global(.cg-pal-input::placeholder) {
    color: rgba(20, 20, 19, 0.32);
  }
  :global([data-theme="DARK"] .cg-pal-input) {
    color: #f7f8f8;
  }
  :global([data-theme="DARK"] .cg-pal-input::placeholder) {
    color: rgba(247, 248, 248, 0.28);
  }

  :global(.cg-pal-esc-btn) {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
    opacity: 0.65;
    transition: opacity 0.15s;
  }
  :global(.cg-pal-esc-btn:hover) { opacity: 1; }

  /* ── List ────────────────────────────────────────────────────── */
  :global(.cg-pal-list) {
    max-height: 336px;
    overflow-y: auto;
    padding: 6px 0;
    overscroll-behavior: contain;
  }
  :global(.cg-pal-list::-webkit-scrollbar)       { width: 3px; }
  :global(.cg-pal-list::-webkit-scrollbar-track) { background: transparent; }
  :global(.cg-pal-list::-webkit-scrollbar-thumb) {
    background: rgba(20, 20, 19, 0.12);
    border-radius: 2px;
  }
  :global([data-theme="DARK"] .cg-pal-list::-webkit-scrollbar-thumb) {
    background: rgba(255, 255, 255, 0.1);
  }

  /* ── Empty ───────────────────────────────────────────────────── */
  :global(.cg-pal-empty) {
    padding: 36px 16px;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: rgba(20, 20, 19, 0.38);
  }
  :global([data-theme="DARK"] .cg-pal-empty) {
    color: rgba(247, 248, 248, 0.32);
  }

  /* ── Groups ──────────────────────────────────────────────────── */
  :global(.cg-pal-group)       { padding: 4px 0; }

  :global(.cg-pal-group-label) {
    padding: 8px 18px 3px;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: rgba(20, 20, 19, 0.38);
  }
  :global([data-theme="DARK"] .cg-pal-group-label) {
    color: rgba(247, 248, 248, 0.32);
  }

  /* ── Items ───────────────────────────────────────────────────── */
  :global(.cg-pal-item) {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 38px;
    padding: 0 16px 0 16px;
    cursor: pointer;
    outline: none;
    user-select: none;
    border-left: 2px solid transparent;
    transition: background 0.08s, border-color 0.08s;
  }
  :global(.cg-pal-item[data-selected="true"]) {
    background: rgba(201, 100, 66, 0.06);
    border-left-color: #c96442;
  }
  :global([data-theme="DARK"] .cg-pal-item[data-selected="true"]) {
    background: rgba(201, 100, 66, 0.10);
  }

  :global(.cg-pal-item-icon) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: rgba(20, 20, 19, 0.4);
    transition: color 0.08s;
  }
  :global(.cg-pal-item[data-selected="true"] .cg-pal-item-icon) {
    color: #c96442;
  }
  :global([data-theme="DARK"] .cg-pal-item-icon) {
    color: rgba(247, 248, 248, 0.38);
  }
  :global([data-theme="DARK"] .cg-pal-item[data-selected="true"] .cg-pal-item-icon) {
    color: #c96442;
  }

  :global(.cg-pal-item-label) {
    flex: 1;
    font-family: var(--font-sans);
    font-size: 13.5px;
    font-weight: 400;
    letter-spacing: -0.005em;
    color: var(--foreground);
  }
  :global([data-theme="DARK"] .cg-pal-item-label) {
    color: #f7f8f8;
  }

  :global(.cg-pal-item-ext) {
    display: flex;
    align-items: center;
    margin-left: auto;
    color: rgba(20, 20, 19, 0.28);
  }
  :global([data-theme="DARK"] .cg-pal-item-ext) {
    color: rgba(247, 248, 248, 0.28);
  }

  /* ── Separator ───────────────────────────────────────────────── */
  :global(.cg-pal-sep) {
    height: 1px;
    margin: 4px 0;
    background: rgba(20, 20, 19, 0.07);
  }
  :global([data-theme="DARK"] .cg-pal-sep) {
    background: rgba(255, 255, 255, 0.07);
  }

  /* ── Footer ──────────────────────────────────────────────────── */
  :global(.cg-pal-footer) {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    padding: 0 16px;
    border-top: 1px solid rgba(20, 20, 19, 0.07);
    flex-shrink: 0;
  }
  :global([data-theme="DARK"] .cg-pal-footer) {
    border-top-color: rgba(255, 255, 255, 0.07);
  }

  :global(.cg-pal-hint) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    color: rgba(20, 20, 19, 0.35);
  }
  :global([data-theme="DARK"] .cg-pal-hint) {
    color: rgba(247, 248, 248, 0.28);
  }

  :global(.cg-pal-key) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    height: 16px;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 500;
    color: rgba(20, 20, 19, 0.55);
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.9),
      rgba(232, 230, 220, 0.6)
    );
    border: 1px solid rgba(20, 20, 19, 0.14);
    border-radius: 3px;
    box-shadow:
      rgba(255, 255, 255, 0.5) 0 1px 0 inset,
      rgba(0, 0, 0, 0.06) 0 1px 2px;
  }
  :global([data-theme="DARK"] .cg-pal-key) {
    color: rgba(247, 248, 248, 0.6);
    background: linear-gradient(to bottom, #1c1e20, #161719);
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow:
      rgba(255, 255, 255, 0.06) 0 1px 0 inset,
      rgba(0, 0, 0, 0.3) 0 1px 2px;
  }

  :global(.cg-pal-dot) {
    font-size: 12px;
    color: rgba(20, 20, 19, 0.18);
  }
  :global([data-theme="DARK"] .cg-pal-dot) {
    color: rgba(255, 255, 255, 0.14);
  }

  :global(.cg-pal-brand) {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(201, 100, 66, 0.5);
  }
</style>
