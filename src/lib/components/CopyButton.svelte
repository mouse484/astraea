<script lang="ts">
	import { writable } from 'svelte/store';
	import Button from './elements/Button.svelte';

	export let content: string;
	const copied = writable(false);

	const onClick = async () => {
		await navigator.clipboard.writeText(content);
		copied.set(true);
	};

	copied.subscribe((value) => {
		if (value) {
			setTimeout(() => copied.set(false), 1000);
		}
	});
</script>

<Button on:click={onClick} disabled={$copied}>
	{#if $copied}
		コピーしました
	{:else}
		<slot />
	{/if}
</Button>
