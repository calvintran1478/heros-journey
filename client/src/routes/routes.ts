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
            }
        ]
    }
];