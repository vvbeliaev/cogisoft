<script lang="ts">
  import Menu from "~icons/ph/list";
  import X from "~icons/ph/x";
  import CommandIcon from "~icons/ph/command";

  import CogitoLogo from "$components/LogoSvg.svelte";
  import ThemeController from "$components/ThemeController.svelte";
  import { Button } from "$components/ui/button";

  interface NavLink {
    href: string;
    label: string;
  }

  interface Props {
    path: string;
  }

  const { path }: Props = $props();

  const links: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/labs", label: "Labs" },
    { href: "/blog", label: "Blog" },
  ];

  let mobileOpen = $state(false);
  let scrolled = $state(false);

  $effect(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 40;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  // Lock body scroll and handle Escape when drawer is open
  $effect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") mobileOpen = false;
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
      };
    } else {
      document.body.style.overflow = "";
    }
  });

  function openPalette() {
    window.dispatchEvent(new CustomEvent("cogito:open-palette"));
  }
</script>

<header class="cg-header" class:scrolled>
  <div class="cg-bar">
    <div class="cg-inner">
      <!-- Logo -->
      <a href="/" class="logo-link">
        <span class="logo-icon">
          <CogitoLogo class="size-9" />
        </span>
        <span class="logo-text">
          <span class="logo-name">Cogito Software</span>
          <span class="logo-tagline label-mono">own your tech</span>
        </span>
      </a>

      <!-- Desktop nav -->
      <nav class="desk-nav">
        {#each links as link (link.href)}
          <a
            href={link.href}
            class="nav-link"
            class:active={path === link.href}
          >
            {link.label}
          </a>
        {/each}
      </nav>

      <!-- Desktop actions -->
      <div class="actions">
        <div class="desk-actions">
          <ThemeController />
          <button
            type="button"
            onclick={openPalette}
            class="search-btn surface-lift"
            aria-label="Open command palette"
          >
            <CommandIcon class="size-3.5" />
            <span>Search</span>
            <span class="kbd-group">
              <kbd class="kbd-cap">⌘</kbd>
              <kbd class="kbd-cap">K</kbd>
            </span>
          </button>
          <Button href="/contact" class="h-9 px-5 text-[13px]">Contact</Button>
        </div>

        <!-- Mobile hamburger -->
        <div class="mob-trigger">
          <button
            type="button"
            class="mob-btn"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onclick={() => (mobileOpen = true)}
          >
            <Menu class="size-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- Mobile drawer backdrop -->
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
  class="mob-backdrop"
  class:visible={mobileOpen}
  onclick={() => (mobileOpen = false)}
  aria-hidden="true"
></div>

<!-- Mobile drawer panel -->
<aside class="mob-drawer" class:open={mobileOpen} aria-label="Navigation menu">
  <div class="drawer-head">
    <span class="label-mono">Navigation</span>
    <button
      type="button"
      onclick={() => (mobileOpen = false)}
      class="drawer-close"
      aria-label="Close menu"
    >
      <X class="size-5" />
    </button>
  </div>

  <nav class="drawer-nav">
    {#each links as link (link.href)}
      <a
        href={link.href}
        class="drawer-link"
        class:active={path === link.href}
        onclick={() => (mobileOpen = false)}
      >
        {link.label}
      </a>
    {/each}
  </nav>

  <div class="drawer-foot">
    <div class="drawer-foot-row">
      <div>
        <div class="label-mono mb-2">Contact</div>
        <a
          href="mailto:contact@cogisoft.dev"
          class="text-sm font-medium transition-colors hover:text-primary"
        >
          contact@cogisoft.dev
        </a>
      </div>
      <div>
        <div class="label-mono mb-2">Theme</div>
        <ThemeController />
      </div>
    </div>
    <div class="label-mono">— cogito software © 2025</div>
  </div>
</aside>

<style>
  /* ── Outer shell: centered island wrapper ───────────────────────────── */
  .cg-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    pointer-events: none;
    display: flex;
    justify-content: center;
    padding: 14px 20px;
    transition: padding 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cg-header.scrolled {
    padding: 10px 24px;
  }

  /* ── Visual bar: floating glass island ──────────────────────────────── */
  .cg-bar {
    pointer-events: auto;
    width: 100%;
    max-width: 76rem;
    border-radius: 14px;
    background: color-mix(in oklch, var(--background), transparent 15%);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid color-mix(in oklch, var(--foreground), transparent 88%);
    box-shadow:
      rgba(20, 20, 19, 0.05) 0 2px 12px 0,
      rgba(255, 255, 255, 0.6) 0 1px 0 0 inset;
    transition:
      background 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      backdrop-filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .scrolled .cg-bar {
    background: color-mix(in oklch, var(--background), transparent 5%);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border-color: color-mix(in oklch, var(--foreground), transparent 82%);
    box-shadow:
      rgba(0, 0, 0, 0.08) 0 8px 32px -4px,
      rgba(255, 255, 255, 0.7) 0 1px 0 0 inset;
  }

  /* Dark overrides */
  :global([data-theme="DARK"]) .cg-bar {
    background: color-mix(in oklch, var(--background), transparent 8%);
    border-color: color-mix(in oklch, var(--foreground), transparent 90%);
    box-shadow:
      rgba(255, 255, 255, 0.04) 0 1px 0 0 inset,
      rgba(0, 0, 0, 0.3) 0 2px 12px 0;
  }

  :global([data-theme="DARK"]) .scrolled .cg-bar {
    background: color-mix(in oklch, var(--background), transparent 3%);
    border-color: color-mix(in oklch, var(--foreground), transparent 85%);
    box-shadow:
      rgba(255, 255, 255, 0.05) 0 1px 0 0 inset,
      rgba(0, 0, 0, 0.5) 0 12px 48px -8px;
  }

  /* Mobile: full-width flat header, no island */
  @media (max-width: 767px) {
    .cg-header {
      padding: 0;
    }

    .cg-bar {
      border-radius: 0;
      border-left: none;
      border-right: none;
      border-top: none;
      max-width: 100%;
    }
  }

  /* ── Inner layout ───────────────────────────────────────────────────── */
  .cg-inner {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.25rem;
    transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .scrolled .cg-inner {
    height: 48px;
  }

  /* ── Logo ───────────────────────────────────────────────────────────── */
  .logo-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  .logo-link:hover {
    opacity: 0.78;
  }

  .logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
  }

  .logo-text {
    display: none;
    flex-direction: column;
    line-height: 1.3;
  }

  @media (min-width: 640px) {
    .logo-text {
      display: flex;
    }
  }

  .logo-name {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: var(--foreground);
  }

  .logo-tagline {
    font-size: 0.625rem;
  }

  /* ── Desktop nav ────────────────────────────────────────────────────── */
  .desk-nav {
    display: none;
    align-items: center;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .desk-nav {
      display: flex;
    }
  }

  .nav-link {
    position: relative;
    font-size: 13px;
    font-weight: 500;
    color: color-mix(in oklch, var(--foreground), transparent 38%);
    text-decoration: none;
    padding-bottom: 2px;
    transition: color 0.2s;
  }

  .nav-link::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1.5px;
    background: var(--primary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nav-link:hover {
    color: var(--foreground);
  }

  .nav-link:hover::after,
  .nav-link.active::after {
    transform: scaleX(1);
  }

  .nav-link.active {
    color: var(--primary);
  }

  /* ── Actions ────────────────────────────────────────────────────────── */
  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .desk-actions {
    display: none;
    align-items: center;
    gap: 0.75rem;
  }

  @media (min-width: 768px) {
    .desk-actions {
      display: flex;
    }
  }

  .search-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    font-size: 13px;
    color: color-mix(in oklch, var(--foreground), transparent 50%);
    cursor: pointer;
    border: none;
    transition: color 0.2s;
  }

  .search-btn:hover {
    color: var(--foreground);
  }

  .kbd-group {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  /* ── Mobile trigger ─────────────────────────────────────────────────── */
  .mob-trigger {
    display: block;
  }

  @media (min-width: 768px) {
    .mob-trigger {
      display: none;
    }
  }

  .mob-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    color: var(--foreground);
    background: none;
    border: none;
    cursor: pointer;
  }

  /* ── Mobile backdrop ────────────────────────────────────────────────── */
  .mob-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(0, 0, 0, 0);
    transition: background 0.3s ease;
  }

  .mob-backdrop.visible {
    display: block;
    background: rgba(0, 0, 0, 0.35);
  }

  /* ── Mobile drawer ──────────────────────────────────────────────────── */
  .mob-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 85vw;
    max-width: 320px;
    z-index: 70;
    background: var(--background);
    transform: translateX(100%);
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    border-left: 1px solid
      color-mix(in oklch, var(--foreground), transparent 90%);
  }

  .mob-drawer.open {
    transform: translateX(0);
  }

  .drawer-head {
    display: flex;
    height: 64px;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    flex-shrink: 0;
    border-bottom: 1px solid
      color-mix(in oklch, var(--foreground), transparent 90%);
  }

  .drawer-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    color: color-mix(in oklch, var(--foreground), transparent 40%);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
  }

  .drawer-close:hover {
    color: var(--foreground);
  }

  .drawer-nav {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 3rem 2rem;
    flex: 1;
  }

  .drawer-link {
    font-family: var(--font-display);
    font-size: 1.875rem;
    font-weight: 500;
    letter-spacing: var(--cg-tracking-section);
    color: color-mix(in oklch, var(--foreground), transparent 60%);
    text-decoration: none;
    transition:
      color 0.2s,
      transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    display: block;
  }

  .drawer-link:hover {
    color: var(--foreground);
    transform: translateX(4px);
  }

  .drawer-link.active {
    color: var(--primary);
  }

  .drawer-foot {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    flex-shrink: 0;
    border-top: 1px solid
      color-mix(in oklch, var(--foreground), transparent 90%);
  }

  .drawer-foot-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
</style>
