import type { ComponentProps } from "react";
import { useFormContext } from "../app-form";

export default function FormError(props: ComponentProps<"div">) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.errors}>
      {(errors) =>
        errors.length > 0 && (
          <div role="alert" {...props}>
            {errors.map((e) => (
              <p key={e.message}>{e.message}</p>
            ))}
          </div>
        )
      }
    </form.Subscribe>
  );
}
