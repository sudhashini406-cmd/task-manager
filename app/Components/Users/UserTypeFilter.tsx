import React, { useState } from "react";
import Select from "react-select";

const options = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export const UserTypeFilter = ({ onChange }: { onChange: (value: string | null) => void }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selected: any) => {
    setSelectedOption(selected);
    onChange(selected ? selected.value : null);
  };

  return (
   
    <Select
      value={selectedOption}
      onChange={handleChange}
      
      options={options}
      placeholder="Select User Type"
      isClearable
      isSearchable
      className="w-60"
    />
  );
};

export default UserTypeFilter;
