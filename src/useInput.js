import { useState } from "react";

const useInput = (iniitialValue) => {
  const [value, setValue] = useState(iniitialValue);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return {
    value,
    onChange: handleChange,
    setValue: setValue,
  };
};

export default useInput;
