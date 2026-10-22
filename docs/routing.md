# Routing

using [react-router-auto-routes](https://github.com/kenn/react-router-auto-routes)

## Notes:

- Route hierarchy means URL is nested, by default not component nested
- To opt into component nesting we use _layout.tsx
- Loaders for ever matched route run in parallel. eg: /users/notes
  - root loader
  - users/_layout loader
  - notes/_layout loader
  - $noteId loader

- For Nested URLs without Layout Nesting with a trailing underscore on the parent segment (usage_.policy.tsx) (used for docs)
