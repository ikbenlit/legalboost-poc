<!-- Header.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
</script>

<header class="bg-white shadow-sm fixed w-full top-0 z-50">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div class="flex w-full items-center justify-between border-b border-indigo-500 py-6 lg:border-none">
            <div class="flex items-center">
                <a href="/" class="text-2xl font-bold text-indigo-600">
                    LegalBoost
                </a>
                <div class="ml-10 space-x-8">
                    <a
                        href="/"
                        class="text-base font-medium {$page.url.pathname === '/' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}"
                    >
                        Generator
                    </a>
                    <a
                        href="/analyze"
                        class="text-base font-medium {$page.url.pathname === '/analyze' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}"
                    >
                        Analyse
                    </a>
                </div>
            </div>
        </div>
    </nav>
</header>

<!-- Spacer voor fixed header -->
<div class="h-24"></div> 