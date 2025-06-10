import { treaty as treatyFactory } from "@elysiajs/eden";
import type { App } from "./types";

export const treaty: typeof treatyFactory<App> = treatyFactory<App>;
