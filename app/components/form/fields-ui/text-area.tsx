import type { FieldWithValue } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { fieldComponent } from "../field-brand";
import { getErrorId } from "../utils";

interface FormTextAreaProps extends ComponentProps<"textarea"> {
  field: FieldWithValue<string>;
}

function FormTextArea(props: FormTextAreaProps) {
  const { field, ...textAreaProps } = props;
  const isInvalid = field.meta.isInvalid;

  return (
    <textarea
      {...textAreaProps}
      id={field.name}
      name={field.name}
      value={field.value}
      onChange={(event) => field.handleChange(event.target.value)}
      onBlur={field.handleBlur}
      aria-invalid={field.meta.isInvalid}
      aria-describedby={
        isInvalid ? getErrorId(field.form.formId, field.name) : undefined
      }
    />
  );
}

export default fieldComponent.strict(FormTextArea, "field");
