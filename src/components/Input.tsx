import { forwardRef } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelContent?: string;
  classNameInput?: string;
  inputName: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ labelContent, type, placeholder, classNameInput, inputName, error, ...rest }, ref) => {
    const isFieldError = (error: any): error is FieldError =>
  error && typeof error.message === "string";
    return (
      <div className="flex gap-1 text-paragraph flex-col w-full">
        {labelContent && (
          <label className="font-semibold" htmlFor={inputName}>
            {labelContent}
          </label>
        )}
        <input
          id={inputName}
          ref={ref}
          type={type}
          placeholder={placeholder}
          {...rest}
          className={`border w-full text-base border-border-input p-2 py-1.5 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-bg focus:border-primary-bg placeholder:text-[#928d8d] placeholder:font-normal ${classNameInput}`}
        />

        {isFieldError(error) && (
        <span className="text-red-500 text-xs">{error.message}</span>
        )}

      </div>
    );
  }
);

Input.displayName = "Input"; // <- necesario con forwardRef

export default Input;
