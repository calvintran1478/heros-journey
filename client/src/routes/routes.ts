import { Route } from "@vaadin/router";

export const routes: Route[] = [
    {
        path: '/',
        children: [
            {
                path: 'character-creation',
                component: 'character-creation',
                action: async () => {
                    await import('../pages/character-creation');
                    document.getElementById("html")!.className = "character-creation";
                }
            },
            {
                path: 'character-selection',
                component: 'character-selection',
                action: async () => {
                    await import('../pages/character-selection');
                    document.getElementById("html")!.className = "character-selection"
                }
            }
        ]
    }
];