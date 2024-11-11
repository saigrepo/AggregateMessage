import React, {useState} from "react";
import Select from "react-select/base";

const ToggleMenu = () => {
    const options = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
        { value: "option4", label: "Option 4" },
    ];
    const [selectedOption, setSelectedOption] = useState(null);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleMenuOpen = () => {
        console.log("Dropdown menu opened");
    };

    return (
        <select value={selectedOption} onChange={handleChange}>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
        </select>
    );
}

export default ToggleMenu;