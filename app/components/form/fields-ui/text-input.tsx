import type { FieldWithValue } from "@tanstack/react-form";
import { useRef, type ComponentProps } from "react";
import { fieldComponent } from "../field-brand";
import { getErrorId } from "../utils";
import { useIsoLayoutEffect } from "~/hooks/useIsoLayoutEffect ";
import { useMergedRefs } from "~/hooks/useMergeRefs";

interface FormTextInputProps extends ComponentProps<"input"> {
  field: FieldWithValue<string>;
}

function FormTextInput(props: FormTextInputProps) {
  const { field, ref: externalRef, ...inputProps } = props;
  const ref = useRef<HTMLInputElement>(null);
  const isInvalid = field.meta.isInvalid;

  const setRef = useMergedRefs(externalRef, ref);
  // sync dom values on mount
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (el && el.value !== field.value) {
      field.handleChange(el.value);
    }
    // mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <input
      // That ensures callers cannot accidentally override the properties that keep the input connected to TanStack Form
      {...inputProps}
      ref={setRef}
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
