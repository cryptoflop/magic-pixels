import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	define: {
		global: {
			NULL_ADDR: "0x0000000000000000000000000000000000000000"
		}
	}
})