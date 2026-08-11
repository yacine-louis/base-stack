export type RouteId =
  | "root"
  | "routes/users_.$username_.notes"
  | "routes/users_.$username_.notes.$noteId"
  | "routes/users_.$username"
  | "routes/_index"
  | "routes/users";
