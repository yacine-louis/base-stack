import type { AnyFieldApi } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { fieldComponent } from "../field-brand";
import { getErrorId } from "../utils";

interface FormErrorProps extends ComponentProps<"div"> {
  field: AnyFieldApi;
}

function FieldError(props: FormErrorProps) {
  const { field, ...divProps } = props;
  const { errors } = field;
  return (
    <div
      role="alert"
      {...divProps}
      id={getErrorId(field.form.formId, field.name)}
    >
      {errors.length > 0 && (
        <ul className="m-0 ml-4 flex list-none flex-col gap-1">
          {errors.map((error, i) => (
            <li key={`${i}-${error.message}`}>{error.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default fieldComponent.loose(FieldError, "field");
