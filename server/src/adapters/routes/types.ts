export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RouteHandler = (payload?: unknown) => unknown;

export interface RouteDefinition {
  handler: RouteHandler;
  method: HttpMethod;
  path: string;
}

export interface RouterModule {
  basePath: string;
  moduleName: string;
  routes: RouteDefinition[];
}

export interface RegisteredRoute {
  fullPath: string;
  method: HttpMethod;
  moduleName: string;
}
