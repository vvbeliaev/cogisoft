<script module>
  let submitted = $state(false);
</script>

<script lang="ts">
  import ArrowRight from "~icons/ph/arrow-right";
  import Check from "~icons/ph/check-bold";
  import CheckCircle from "~icons/ph/check-circle-fill";
  import Loader2 from "~icons/ph/circle-notch-bold";
  import Mail from "~icons/ph/envelope-duotone";
  import { actions } from "astro:actions";
  import { Button } from "$components/ui/button";

  let {
    experiment,
    intent,
    buttonLabel,
    subtext,
    placeholder,
    accented = true,
    column = false,
  } = $props();

  let email = $state("");
  let isSubmitting = $state(false);
  let errorMessage = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = "";
    isSubmitting = true;

    try {
      const href = typeof window !== "undefined" ? window.location.href : "";
      const referrer = typeof document !== "undefined" ? document.referrer : "";

      const { error } = await actions.createLead({
        email,
        experiment,
        meta: { email, intent, href, referrer },
      });

      if (error) {
        throw new Error(error.message);
      }

      submitted = true;
    } catch (error) {
      errorMessage = "Something went wrong. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function reset() {
    submitted = false;
    email = "";
    errorMessage = "";
  }
</script>

{#if submitted}
  <div
    class="surface-lift p-6 md:p-8 flex flex-col items-center text-center gap-4 animate-in"
  >
    <div
      class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-1 md:mb-2"
    >
      <CheckCircle class="w-8 h-8 md:w-10 md:h-10 text-primary" />
    </div>
    <div class="min-w-0">
      <h3 class="text-lg md:text-xl">You're on the list!</h3>
      <p
        class="text-sm md:text-base text-foreground/70 mt-2 max-w-xs text-pretty"
      >
        I'll reach out to <strong>{email}</strong>
      </p>
      <Button
        variant="ghost"
        size="sm"
        class="mt-4 md:mt-6 opacity-60 hover:opacity-100"
        onclick={reset}
      >
        Add another email
      </Button>
    </div>
  </div>
{:else}
  <div class={accented ? "relative group w-full" : "w-full"}>
    {#if accented}
      <!-- Accented version -->
      <div
        class="surface-lift relative px-4 py-6 md:p-8 transition-opacity hover:opacity-95"
        style="box-shadow: color-mix(in oklch, var(--primary), transparent 78%) 0 0 0 1px;"
      >
        <div class="relative">
          <div class="flex items-center gap-2 mb-4 md:mb-6 px-1">
            <div class="relative">
              <div
                class="w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-75 absolute inset-0"
              ></div>
              <div class="w-2.5 h-2.5 rounded-full bg-primary relative"></div>
            </div>
            <span class="label-accent">Limited Early Access</span>
          </div>

          <form class="w-full space-y-3 md:space-y-4" onsubmit={handleSubmit}>
            <label
              class="flex items-center gap-3 px-4 h-14 md:h-16 w-full bg-background/40 focus-within:bg-background transition-colors"
              style="box-shadow: color-mix(in oklch, var(--foreground), transparent 88%) 0 0 0 1px inset;"
            >
              <Mail
                class="w-4 h-4 md:w-5 md:h-5 opacity-30 group-focus-within:opacity-100 transition-opacity"
              />
              <input
                type="email"
                {placeholder}
                class="grow bg-transparent border-none outline-none focus:ring-0 text-sm md:text-lg text-foreground placeholder:text-foreground/40"
                bind:value={email}
                required
              />
            </label>

            <Button
              type="submit"
              class="w-full h-12 md:h-16 text-sm md:text-lg gap-3 px-4"
              disabled={isSubmitting}
            >
              {#if isSubmitting}
                <Loader2 class="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                <span>Processing...</span>
              {:else}
                <span class="truncate">{buttonLabel}</span>
                <ArrowRight
                  class="w-5 h-5 md:w-6 md:h-6 shrink-0 group-hover:translate-x-1 transition-transform"
                />
              {/if}
            </Button>

            {#if subtext}
              <div
                class="pt-2 text-[11px] text-foreground/50 flex items-center justify-center gap-2 font-medium text-center"
              >
                <Check class="w-3.5 h-3.5 text-primary/70" />
                {subtext}
              </div>
            {/if}

            {#if errorMessage}
              <div
                class="mt-4 text-sm px-4 py-3 text-destructive bg-destructive/10"
              >
                {errorMessage}
              </div>
            {/if}
          </form>
        </div>
      </div>
    {:else}
      <!-- Regular version -->
      <form class="w-full" onsubmit={handleSubmit}>
        <div
          class={column
            ? "flex flex-col gap-3"
            : "flex flex-col sm:flex-row gap-2"}
        >
          <label
            class="flex-1 flex items-center gap-3 px-4 w-full h-[52px] bg-background/50 focus-within:bg-background transition-colors"
            style="box-shadow: color-mix(in oklch, var(--foreground), transparent 88%) 0 0 0 1px inset;"
          >
            <Mail class="w-4 h-4 opacity-40" />
            <input
              type="email"
              {placeholder}
              class="grow bg-transparent border-none outline-none focus:ring-0 py-3 text-sm text-foreground placeholder:text-foreground/40"
              bind:value={email}
              required
            />
          </label>
          <Button
            type="submit"
            class="h-[52px] px-8 {column ? 'w-full' : ''}"
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              <Loader2 class="w-4 h-4 animate-spin" />
            {:else}
              <span class="truncate">{buttonLabel}</span>
              <ArrowRight class="w-4 h-4 shrink-0" />
            {/if}
          </Button>
        </div>

        {#if subtext}
          <div
            class="mt-4 label-mono text-center sm:text-left px-1 leading-relaxed"
          >
            {subtext}
          </div>
        {/if}

        {#if errorMessage}
          <div
            class="mt-3 text-xs px-4 py-2 text-destructive bg-destructive/10"
          >
            {errorMessage}
          </div>
        {/if}
      </form>
    {/if}
  </div>
{/if}
