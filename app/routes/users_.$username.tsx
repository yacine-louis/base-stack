import { useParams } from "react-router";

export default function RouteComponent() {
  const { username } = useParams();
  return <>User page ({username})</>;
}
