import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// Optionele instellingen voor Vercel
			runtime: 'nodejs18.x', // Zorg dat dit overeenkomt met je Node-versie
		}),
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
