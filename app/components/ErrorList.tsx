import { cn } from "~/utils/misc";

export function ErrorList({
  errors,
  errorId,
  className,
  ...props
}: {
  errors: string[] | undefined;
  errorId: string | undefined;
} & React.ComponentPropsWithoutRef<"li">) {
  return (
    <ul id={errorId}>
      {errors?.map((error) => (
        <li key={error} className={cn("text-red-500", className)} {...props}>
          {error}
        </li>
      ))}
    </ul>
  );
}
