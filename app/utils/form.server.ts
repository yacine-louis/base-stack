import { serverValidateHelper } from "@tanstack/react-form";
import { next as reactRouter } from "@tanstack/react-form-nextjs";

export const { createServerValidate } = serverValidateHelper({
  framework: reactRouter(),
});
