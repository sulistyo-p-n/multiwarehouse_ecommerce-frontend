
import React, { useState, forwardRef, useImperativeHandle } from "react";

import { ValidatedRef } from "./ValidatefRef";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface ValidatedDropdownProps {
    name: string;
    label: string;
    value?: string;
    options: string[];
    required?: boolean;
    validators?: ((value: string) => any)[];
    onChange?: (name: string, value: string) => any;
}

const ValidatedDropdown = forwardRef<ValidatedRef, ValidatedDropdownProps> (
    ({ name, label, value = "", options = [], required = false, validators, onChange }, ref) => {

    const [val, setVal] = useState(value);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const handleChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        setVal(value);
        if (!(onChange === undefined)) onChange(name, value);
        validateValue(value);
    };

    const validate = (): boolean => {
        return validateValue(val);
    }

    const validateValue = (value: string): boolean => {
        setErrorMessage("");
        setError(false);

        if (!required && value.length == 0) {
            return true;
        }

        if (required && value.length == 0) {
            setErrorMessage("is required");
            setError(true);
            return false;
        }

        var isValidate = true;
        validators?.every((validator) => {
            const validatedMessage = validator(value);
            if (validatedMessage === true) return true;
            setErrorMessage(validatedMessage);
            setError(true);
            isValidate = false;
            return false;
        });

        return isValidate;
    }

    useImperativeHandle(ref, () => ({
        validate,
      }));

    return (
        <>
            <FormControl fullWidth margin="normal" required={required} error={error}>
                <InputLabel id={"id_select_" + label}>{label}</InputLabel>
                <Select
                    labelId={"id_" + label}
                    id={"id_select_helper_" + label}
                    value={val}
                    label={label}
                    onChange={handleChange}
                >
                    <MenuItem disabled value=""><em>None</em></MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                <FormHelperText>{errorMessage}</FormHelperText>
            </FormControl>
        </>
    );
});

export default ValidatedDropdown;