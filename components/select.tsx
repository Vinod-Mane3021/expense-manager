import { LabelValueType } from "@/types/transaction";
import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
  onChange: (value?: string) => void;
  value?: string | null | undefined;
  onCreate?: (value: string) => void;
  options?: LabelValueType[];
  disabled?: boolean;
  placeholder?: string;
};

const Select = ({
  value,
  onChange,
  onCreate,
  options = [],
  disabled,
  placeholder,
}: Props) => {
  const onSelect = (option: SingleValue<LabelValueType>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value == value);
  }, [options, value]);

  return (
    <CreatableSelect
      className="text-sm h-10"
      placeholder={placeholder}
      options={options}
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#E2E8F0",
          ":hover": {
            borderColor: "#E2E8F0",
          },
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
};

export default Select;
