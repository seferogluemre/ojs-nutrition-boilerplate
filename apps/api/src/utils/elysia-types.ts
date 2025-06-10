import { BaseMacro, InputSchema, LocalHook, RouteSchema, SingletonBase } from 'elysia';

export type ControllerHook = LocalHook<
  InputSchema<never>,
  RouteSchema,
  SingletonBase,
  Record<string, Error>,
  BaseMacro,
  string
>;

export type ExtractBody<T> = T extends { body: infer B } ? B : unknown;
