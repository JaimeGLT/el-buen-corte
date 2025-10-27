import React, { forwardRef } from "react";
import type { FieldError } from "react-hook-form";

interface opts {
    value?: string;
    valueBoolean?: boolean;
    name: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  labelContent?: string;
  classNameSelect?: string;
  selectName: string;
  opts: opts[];
  error?: FieldError
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ labelContent, classNameSelect, selectName, opts, error, placeholder, ...rest }, ref) => {
    
    return (
      <div className="flex gap-1 text-paragraph flex-col w-full">
        {labelContent && (
          <label className="font-semibold" htmlFor={selectName}>
            {labelContent}
          </label>
        )}

        <select
          id={selectName}
          ref={ref}
          {...rest}
          className={`border w-full  text-base border-border-input py-1.5 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-bg focus:border-primary-bg placeholder:text-[#928d8d] placeholder:font-normal px-3  ${classNameSelect}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
            {
              
                opts?.map((item, i) => {
                  const value = item.value ?? String(item.valueBoolean);

                  return <option  key={i} value={value}>{item.name}</option>
                }
                )
            }
        </select>
        { error && <span className="text-red-500 text-xs">{error.message}</span>  }
      </div>
    );
  }
);

Select.displayName = "Select"; 

export default Select;
