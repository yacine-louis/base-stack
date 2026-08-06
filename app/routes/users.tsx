import { Outlet } from "react-router";

export default function RouteComponent() {
  return (
    <>
      Users page
      <Outlet />
    </>
  );
}
