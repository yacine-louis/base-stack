import type { AnyFieldApi } from "@tanstack/react-form";
import type { ComponentProps } from "react";
import { fieldComponent } from "../field-brand";

interface FormLabelProps extends ComponentProps<"label"> {
  field: AnyFieldApi;
}

function FormLabel(props: FormLabelProps) {
  const { field, ...labelProps } = props;
  return <label {...labelProps} htmlFor={props.htmlFor ?? field.name} />;
}

// We use fieldComponent instead of fieldBrand so that we don't have to pass `field` again.
// This component isn't generic, so that is safe.

// We don't care what type of field uses this, so loose is acceptable
export default fieldComponent.loose(FormLabel, "field");
