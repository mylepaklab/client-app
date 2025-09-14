import { createBrowserRouter, type RouteObject } from "react-router";

import { Page as MainPage } from "~/pages/main.page";

const defineRouter = (path: string, Component: RouteObject["Component"]) => ({
	path,
	Component,
});

export const router = createBrowserRouter([defineRouter("/", MainPage)]);
