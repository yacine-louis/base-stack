/* oxlint-disable */
// already implemented in nextjs package, so i don't have to manage another version of @tanstack/form-core
// import { decode } from "decode-formdata";
// import { validateServerValues } from "@tanstack/form-core/internals";
// import type {
//   FormOptions,
//   FormValidators,
//   ServerValidateFrameworkPlugin,
//   ServerValidateResult,
// } from "@tanstack/react-form";
// import type { FormDataInfo } from "decode-formdata";

// export type RouterServerValidate<
//   TFormData,
//   TFormValidators extends FormValidators<TFormData>,
// > = (
//   formData: FormData,
// ) => Promise<ServerValidateResult<TFormData, TFormValidators>>;

// export interface RouterServerValidateOptions {
//   info?: FormDataInfo;
// }

// type RouterCreateServerValidate = <
//   TFormData,
//   const TFormValidators extends FormValidators<TFormData>,
//   TSubmitReturn,
// >(
//   options: FormOptions<TFormData, TFormValidators, TSubmitReturn, unknown>,
// ) => RouterServerValidate<TFormData, TFormValidators>;

// function decodeFormData<TFormData>(
//   formData: FormData,
//   info: FormDataInfo | undefined,
// ): TFormData {
//   return (info ? decode(formData, info) : decode(formData)) as TFormData;
// }

// export function reactRouter(
//   options: RouterServerValidateOptions = {},
// ): ServerValidateFrameworkPlugin<RouterCreateServerValidate> {
//   return {
//     id: "react-form-react-router",
//     createServerValidate: <
//       TFormData,
//       const TFormValidators extends FormValidators<TFormData>,
//       TSubmitReturn,
//     >(
//       formOptions: FormOptions<
//         TFormData,
//         TFormValidators,
//         TSubmitReturn,
//         unknown
//       >,
//     ) => {
//       return async (formData) => {
//         const values = decodeFormData<TFormData>(formData, options.info);

//         return validateServerValues(formOptions, values);
//       };
//     },
//   };
// }
