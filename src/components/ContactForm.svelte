<script lang="ts">
  import Send from "~icons/ph/paper-plane-tilt-fill";
  import CheckCircle from "~icons/ph/check-circle-fill";
  import Loader2 from "~icons/ph/circle-notch-bold";
  import { actions } from "astro:actions";

  let isSubmitting = $state(false);
  let formSubmitted = $state(false);
  let errorMessage = $state("");

  let name = $state("");
  let email = $state("");
  let message = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    errorMessage = "";

    try {
      const { error } = await actions.createLead({
        name,
        email,
        message,
        experiment: "agency-contact",
      });

      if (error) {
        throw new Error(error.message);
      }

      formSubmitted = true;
    } catch (err) {
      errorMessage = "Something went wrong. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    formSubmitted = false;
    name = "";
    email = "";
    message = "";
  }
</script>

{#if formSubmitted}
  <div
    class="py-14 text-center"
    style="animation: cg-fade-up 0.5s cubic-bezier(0.2,0.8,0.2,1) forwards;"
  >
    <div
      class="inline-flex items-center justify-center w-14 h-14 mb-6 text-primary"
      style="box-shadow: rgba(201,100,66,0.18) 0 0 0 1px;"
    >
      <CheckCircle class="w-7 h-7" />
    </div>
    <div class="label-accent mb-3">message received</div>
    <p class="text-foreground/60 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
      I'll reply within 24 hours on business days.
    </p>
    <button
      onclick={resetForm}
      class="text-xs font-mono uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
    >
      Send another →
    </button>
  </div>
{:else}
  <form onsubmit={handleSubmit} novalidate class="flex flex-col gap-5">

    <div class="flex flex-col gap-2">
      <label for="email" class="label-mono">
        Email <span class="text-primary">*</span>
      </label>
      <input
        id="email"
        type="email"
        placeholder="your@email.com"
        bind:value={email}
        required
        class="cg-input"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="name" class="label-mono">Name</label>
      <input
        id="name"
        type="text"
        placeholder="Your name"
        bind:value={name}
        class="cg-input"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="message" class="label-mono">Message</label>
      <textarea
        id="message"
        placeholder="Tell us about your project..."
        bind:value={message}
        rows={5}
        class="cg-input"
        style="padding-top: 0.75rem; padding-bottom: 0.75rem; resize: none; line-height: 1.6;"
      ></textarea>
    </div>

    {#if errorMessage}
      <p class="text-sm text-destructive">{errorMessage}</p>
    {/if}

    <button
      type="submit"
      disabled={isSubmitting || !email}
      class="cg-submit"
    >
      {#if isSubmitting}
        <span class="flex items-center gap-2">
          <Loader2 class="w-4 h-4 animate-spin" />
          Sending...
        </span>
        <span></span>
      {:else}
        <span>Send message</span>
        <Send class="w-4 h-4" />
      {/if}
    </button>

  </form>
{/if}

<style>
  :global(.cg-input) {
    width: 100%;
    height: 2.75rem;
    padding: 0 0.875rem;
    font-family: var(--font-sans);
    font-size: 0.9375rem;
    color: var(--foreground);
    background: var(--background);
    border: 1px solid rgba(20, 20, 19, 0.15);
    outline: none;
    transition: border-color 0.15s;
  }

  :global([data-theme="DARK"] .cg-input) {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.1);
  }

  :global(.cg-input:focus) {
    border-color: var(--cg-terracotta);
  }

  :global(.cg-input::placeholder) {
    color: color-mix(in oklch, var(--foreground), transparent 65%);
  }

  :global(textarea.cg-input) {
    height: auto;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    resize: none;
    line-height: 1.6;
  }

  .cg-submit {
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.25rem;
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--cg-ivory);
    background: var(--cg-terracotta);
    border: none;
    cursor: pointer;
    transition: opacity 0.15s;
    margin-top: 0.25rem;
  }

  .cg-submit:hover:not(:disabled) {
    opacity: 0.85;
  }

  .cg-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
