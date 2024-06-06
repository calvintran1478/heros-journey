import { Route } from "@vaadin/router";

const htmlElement = document.getElementById("html")

export const routes: Route[] = [
    {
        path: '/',
        children: [
            {
                path: '',
                component: 'landing-page',
                action: async () => {
                    await import('../pages/landing-page');
                    htmlElement!.className = "landing-page";
                }
            },
            {
                path: 'register',
                component: 'register-page',
                action: async () => {
                    await import('../pages/register-page');
                    htmlElement!.className = "landing-page";
                }
            },
            {
                path: 'login',
                component: 'login-page',
                action: async () => {
                    await import('../pages/login-page');
                    htmlElement!.className = "landing-page";
                }
            },
            {
                path: 'reset-password',
                component: 'reset-password',
                action: async() => {
                    await import('../pages/reset-password');
                    htmlElement!.className = "landing-page";
                }
            },
            {
                path: 'change-password',
                component: 'change-password',
                action: async() => {
                    await import('../pages/change-password');
                    htmlElement!.className = "landing-page";
                }
            },
            {
                path: 'character-creation',
                component: 'character-creation',
                action: async () => {
                    await import('../pages/character-creation');
                    htmlElement!.className = "character-creation";
                }
            },
            {
                path: 'character-selection',
                component: 'character-selection',
                action: async () => {
                    await import('../pages/character-selection');
                    htmlElement!.className = "character-selection"
                }
            }
        ]
    }
];