# Routing

using [react-router-auto-routes](https://github.com/kenn/react-router-auto-routes)

## Notes:

- Route hierarchy means URL is nested, by default not component nested
- To opt into component nesting we use _layout.tsx
- Loaders for ever matched route run in parallel. eg: /users/notes/$noteId
  - `root.tsx` loader
  - `users/_layout.tsx` loader
  - `users/notes/_layout.tsx` loader
  - `users/notes/$noteId.tsx` loader

- For Nested URLs without Layout Nesting with a trailing underscore on the parent segment (usage_.policy.tsx) (used for docs)
- to add children(with layout nesting) to a route move file route (index.tsx) to (_layout.tsx) to preserve (useMatches)
