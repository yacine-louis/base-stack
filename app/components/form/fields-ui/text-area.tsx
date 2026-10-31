import type { FieldWithValue } from "@tanstack/react-form";
import { useRef, type ComponentProps } from "react";
import { fieldComponent } from "../field-brand";
import { getErrorId } from "../utils";
import { useIsoLayoutEffect } from "~/hooks/useIsoLayoutEffect ";
import { useMergedRefs } from "~/hooks/useMergeRefs";

interface FormTextAreaProps extends ComponentProps<"textarea"> {
  field: FieldWithValue<string>;
}

function FormTextArea(props: FormTextAreaProps) {
  const { field, ref: externalRef, ...textAreaProps } = props;
  const ref = useRef<HTMLTextAreaElement>(null);
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
    <textarea
      {...textAreaProps}
      ref={setRef}
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
