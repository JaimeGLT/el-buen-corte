import React, { forwardRef } from "react";
import type { FieldError } from "react-hook-form";

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelContent?: string;
  classNametextArea?: string;
  textAreaName: string;
  error?: FieldError
}

const TextArea = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ labelContent, placeholder, classNametextArea, textAreaName, error, ...rest }, ref) => {
    return (
      <div className="flex gap-1 text-paragraph flex-col w-full">
        {labelContent && (
          <label className="font-semibold" htmlFor={textAreaName}>
            {labelContent}
          </label>
        )}
        <textarea
          id={textAreaName}
          ref={ref}
          placeholder={placeholder}
          rows={2}
          {...rest}
          className={`border w-full text-base border-border-input p-2 py-1.5 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-bg focus:border-primary-bg placeholder:text-[#928d8d] placeholder:font-normal ${classNametextArea}`}
        />
        { error && <span className="text-red-500 text-xs">{error.message}</span>  }
      </div>
    );
  }
);

TextArea.displayName = "TextArea"; 

export default TextArea;
