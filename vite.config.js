export default {
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                // Suppress unused external imports from node_modules
                if (
                    warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
                        /node_modules\/astro/.test(warning.message)
                ) return;

                warn(warning); // Let other warnings through
            }
        }
    }
}
