import { createBrowserRouter, type RouteObject } from "react-router";

import { Main } from "~/pages/main.page";

const defineRouter = (path: string, Component: RouteObject["Component"]) => ({
	path,
	Component,
});

export const router = createBrowserRouter([defineRouter("/", Main)]);
