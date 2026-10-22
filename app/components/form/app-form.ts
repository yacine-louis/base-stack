import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";

// React lazy importing loses generics, so import this directly
const TextInput = lazy(() => import("./fields-ui/text-input"));
const TextArea = lazy(() => import("./fields-ui/text-area"));
const Label = lazy(() => import("./fields-ui/label"));
const Error = lazy(() => import("./fields-ui/error"));

const FormError = lazy(() => import("./form-ui/error"));

export const { appFormOptions, useAppForm, useFormContext } = createFormHook({
  fieldComponents: {
    TextInput,
    TextArea,
    Label,
    Error,
  },
  formComponents: {
    Error: FormError,
  },
});
