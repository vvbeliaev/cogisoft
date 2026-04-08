<script lang="ts">
  interface Props {
    class?: string;
  }

  const { class: className = "" }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 100 100"
  fill="none"
  stroke="currentColor"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  aria-hidden="true"
>
  <!--
    Three-layer Cogisoft mark:
    ① Outer C frame  — 270° arc r=42, opens right (the "C")
    ② Structural detail — inward ticks (N/NW/SW/S), PCB trace stubs
    ③ Core S glyph   — two tangent 270° arcs; each arc is a "C",
                        together they trace an "S"
                        Circle A (35,35) r=21.21 → upper-left bowl
                        Circle B (65,65) r=21.21 → lower-right bowl
                        Tangent at (50,50), shared SW tangent → seamless

    Arc endpoints of outer C:
      SE (45°):  (79.7, 79.7)
      NE (315°): (79.7, 20.3)
  -->

  <!-- ① Outer C frame (thin structural ring) -->
  <path d="M79.7 79.7 A42 42 0 1 1 79.7 20.3" stroke-width="2.5"/>

  <!-- ② Inward calibration ticks -->
  <line x1="50"   y1="8"    x2="50"   y2="15"   stroke-width="2"/>   <!-- N  -->
  <line x1="20.3" y1="20.3" x2="25.3" y2="25.3" stroke-width="2"/>   <!-- NW -->
  <line x1="20.3" y1="79.7" x2="25.3" y2="74.7" stroke-width="2"/>   <!-- SW -->
  <line x1="50"   y1="92"   x2="50"   y2="85"   stroke-width="2"/>   <!-- S  -->

  <!-- ② PCB trace stubs: ring-west → S-left  and  S-right → C-opening -->
  <line x1="8"  y1="50" x2="20" y2="50" stroke-width="2.5"/>
  <line x1="80" y1="50" x2="92" y2="50" stroke-width="2.5"/>

  <!-- ③ Core S glyph -->
  <path d="M20 50 A21.21 21.21 0 1 1 50 50 A21.21 21.21 0 1 0 80 50" stroke-width="7"/>

  <!-- ③ Terminal pads at S endpoints -->
  <circle cx="20" cy="50" r="4.5" fill="currentColor" stroke="none"/>
  <circle cx="80" cy="50" r="4.5" fill="currentColor" stroke="none"/>

  <!-- ③ Junction via at S inflection point (hollow ring = schematic junction) -->
  <circle cx="50" cy="50" r="4.5" stroke-width="2"/>

  <!-- ① C frame endpoint caps -->
  <circle cx="79.7" cy="79.7" r="3" fill="currentColor" stroke="none"/>
  <circle cx="79.7" cy="20.3" r="3" fill="currentColor" stroke="none"/>
</svg>
