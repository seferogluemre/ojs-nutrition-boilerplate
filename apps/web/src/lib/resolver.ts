import { toNestErrors, validateFieldsNatively } from "@hookform/resolvers";
import { TSchema } from "elysia";
import { TypeCompiler } from "elysia/type-system";
import {
  appendErrors,
  FieldError,
  FieldErrors,
  FieldValues,
  ResolverOptions,
  ResolverResult,
} from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseErrorSchema: ParseErrorSchema<any> = (_errors, validateAllFieldCriteria) => {
  const errors: Record<string, FieldError> = {};
  for (; _errors.length; ) {
    const error = _errors[0];
    const { type, message, path } = error;
    const _path = path.substring(1).replace(/\//g, ".");

    if (!errors[_path]) {
      errors[_path] = { message, type: "" + type };
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path].types;
      const messages = types && types["" + type];

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        "" + type,
        messages ? ([] as string[]).concat(messages as string[], error.message) : error.message,
      ) as FieldError;
    }

    _errors.shift();
  }

  return errors;
};

export const typeboxResolver: Resolver = (schema) => async (values, _, options) => {
  const errors = Array.from(TypeCompiler.Compile(schema).Errors(values));
  options.shouldUseNativeValidation && validateFieldsNatively({}, options);

  if (!errors.length) {
    return {
      errors: {} as FieldErrors,
      values,
    };
  }

  return {
    values: {},
    errors: toNestErrors(
      parseErrorSchema(
        errors,
        !options.shouldUseNativeValidation && options.criteriaMode === "all",
      ),
      options,
    ),
  };
};

export type Resolver = <T extends TSchema>(
  schema: T,
) => <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>,
) => Promise<ResolverResult<TFieldValues>>;

export type ParseErrorSchema<T extends object> = (
  _errors: T[],
  validateAllFieldCriteria: boolean,
) => Record<string, FieldError>;
