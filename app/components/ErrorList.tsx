import { cn } from "~/utils/misc";

export function ErrorList({
  errors,
  id,
  className,
  ...props
}: {
  errors: string[] | undefined;
  id: string | undefined;
} & React.ComponentPropsWithoutRef<"li">) {
  return (
    <ul id={id}>
      {errors?.map((error, index) => (
        <li key={index} className={cn("text-red-500", className)} {...props}>
          {error}
        </li>
      ))}
    </ul>
  );
}
