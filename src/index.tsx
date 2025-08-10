import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import { router } from "~/constants/pages.constant";

import "./index.css";

const container = document.querySelector("#root") as Element;
const root = createRoot(container);

root.render(<RouterProvider router={router} />);
