import type { FieldWithValue } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { fieldComponent } from "../field-brand";
import { getErrorId } from "../utils";

interface FormTextInputProps extends ComponentProps<"input"> {
  field: FieldWithValue<string>;
}

function FormTextInput(props: FormTextInputProps) {
  const { field, ...inputProps } = props;
  const isInvalid = field.meta.isInvalid;

  return (
    <input
      // That ensures callers cannot accidentally override the properties that keep the input connected to TanStack Form
      {...inputProps}
      type="text"
      id={field.name}
      name={field.name}
      value={field.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      aria-invalid={isInvalid}
      aria-describedby={
        isInvalid ? getErrorId(field.form.formId, field.name) : undefined
      }
    />
  );
}

// We use fieldComponent instead of fieldBrand so that we don't have to pass `field` again.
// This component isn't generic, so that is safe.

// Strict is important, because if a field is 'a' | 'b', we don't want the user to be able to use a string input
// it passes the context of the field to the component field={useFieldContext}
export default fieldComponent.strict(FormTextInput, "field");
