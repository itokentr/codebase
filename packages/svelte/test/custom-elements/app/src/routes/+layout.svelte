<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  type Props = Pick<HTMLAttributes<HTMLElement>, 'children'>;
  let { children }: Props = $props();
</script>

{@render children?.()}
