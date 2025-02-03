
import React, { useState, forwardRef, useImperativeHandle } from "react";

import { TextField } from "@mui/material";
import { ValidatedRef } from "./ValidatefRef";

interface ValidatedTextFieldProps {
    name: string;
    label: string;
    value?: string;
    required?: boolean;
    readOnly?: boolean;
    validators?: ((value: string) => any)[];
    onChange?: (name: string, value: string) => any;
}

const ValidatedTextField = forwardRef<ValidatedRef, ValidatedTextFieldProps> (
    ({ name, label, value = "", required = false, readOnly = false, validators, onChange }, ref) => {

    const [val, setVal] = useState(value);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <TextField
            fullWidth
            margin="normal"
            required={required}
            label={label}
            value={val}
            onChange={handleChange}
            error={error}
            helperText={errorMessage}
            inputProps={
                { readOnly: readOnly }
            }
        />
    );
});

export default ValidatedTextField;