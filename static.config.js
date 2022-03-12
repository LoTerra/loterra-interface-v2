// This file is used to configure:
// - static-site generation
// - Document shell (index.html)
// - ...tons of other things!

// Get started at https://react-static.js.org

export default {
    disablePreload: true,
    silent: true,
    plugins: [
        ['react-static-plugin-sass'],
        ["react-static-plugin-svg"],
        ['react-static-plugin-react-router'],
    ],
    getSiteData: async ({ dev }) => ({
        title: 'LoTerra is a lottery contract, buy tickets as a player or join the governance! DAO allows making decisions together! Manage the casino 🎰 Set the prize 🏆 Up the ticket price or go cheap 🏷 Extract max profits 🤑 Keep the vault secure at all times!',
        lastBuilt: Date.now(),
    }),
    //maxThreads: 1, // Remove this when you start doing any static generation
    getRoutes: async ({ dev }) => [
        // A simple route
        {
            path: '/',
            template: 'src/pages/Index',
        },
        {
            path: 'staking',
            template: 'src/pages/Staking',
        },
        {
            path: 'dao',
            template: 'src/pages/DAO',
        },
        {
            path: 'dogether',
            template: 'src/pages/Dogether',
        },
        {
            path: 'spacewager',
            template: 'src/pages/SpaceWager',
        },
        {
            path: 'rapido',
            template: 'src/pages/Rapido',
        },
        // A 404 component
        {
            path: '404',
            template: 'src/pages/NotFound',
        },
    ],
}
