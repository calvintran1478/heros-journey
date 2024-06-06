import { Router } from "@vaadin/router";
import { routes } from "./routes/routes";
import "./styles/styles.css"

export const router = new Router(document.getElementById('outlet'));
router.setRoutes(routes);