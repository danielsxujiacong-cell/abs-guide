import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { chapters } from './lib/books';

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  if (!chapters.some((c) => c.href === context.url.pathname)) route.toc = undefined;
  for (const tag of route.head) {
    if (tag.tag === 'meta' && tag.attrs?.name === 'viewport') tag.attrs.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
  }
});
