<script lang="ts">
  let transparency = $state(0.5);
  let competence = $state(0.8);

  let trustScore = $derived((transparency * competence).toFixed(2));
</script>

<div
  class="my-12 p-8 surface-lift not-prose"
>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h4 class="text-xs uppercase tracking-[0.2em] font-black opacity-40 mb-2">
        Interactive Trust Calculator
      </h4>
      <p class="text-sm opacity-60">
        See how transparency and competence impact the final trust score.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-3">
          <div class="flex justify-between text-sm">
            <span class="font-bold opacity-80">Transparency</span>
            <span class="text-primary font-mono"
              >{Math.round(transparency * 100)}%</span
            >
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            bind:value={transparency}
            class="w-full accent-primary"
          />
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex justify-between text-sm">
            <span class="font-bold opacity-80">Competence</span>
            <span class="text-foreground/80 font-mono"
              >{Math.round(competence * 100)}%</span
            >
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            bind:value={competence}
            class="w-full accent-foreground/70"
          />
        </div>
      </div>

      <div
        class="flex items-center justify-center surface-lift p-8"
      >
        <div class="text-center">
          <div
            class="text-6xl font-black tracking-tighter mb-1 font-display"
            style="color: oklch(from var(--primary) l c h / {trustScore})"
          >
            {trustScore}
          </div>
          <div
            class="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30"
          >
            Final Trust Score
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
