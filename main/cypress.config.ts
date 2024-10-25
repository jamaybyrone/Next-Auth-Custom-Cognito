const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {

        setupNodeEvents(on, config) {
            on('task', {
                table(message) {
                    console.table(message)
                    return null
                }
            })
            return config
        },
        baseUrl: process.env.NEXT_PUBLIC_URL,
        chromeWebSecurity: false
    }
})
