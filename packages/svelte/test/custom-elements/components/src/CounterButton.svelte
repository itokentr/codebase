<svelte:options customElement="counter-button" />

<script lang="ts">
  export interface Props {
    readonly name: string;
  }
  let { name }: Props = $props();
  let ordinal = $state(1);
  let suffix = $derived.by(() => {
    switch (ordinal) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
    }
    return 'th';
  });
  function onClick(): void {
    ordinal += 1;
  }
</script>

<button onclick={onClick}>{ordinal}{suffix} Hello {name}!</button>
