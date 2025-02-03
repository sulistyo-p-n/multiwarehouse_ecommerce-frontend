
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

import {Box} from '@mui/material';
import { ValidatedRef } from './ValidatefRef';
import ValidatedDropdown from './ValidatedDropdown';
import ValidatedTextField from './ValidatedTextField';

interface FieldConfig {
    name: string;
    label: string;
    type?: string;
    options?: string[];
    required?: boolean;
    readonly?: boolean;
    validator?: ((value: string) => any)[];
}

interface DynamicFormProps {
    fields: FieldConfig[];
    onSubmit?: (data: Record<string, string>) => void;
}

export interface DynamicFormRef {
    validateAndSubmit: () => boolean;
    getData: () => Record<string, string>;
}

const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps> (
    ({ fields }, ref) => {

    const [formData, setFormData] = useState<Record<string, string>>(
        fields.reduce((acc, field) => {
            acc[field.name] = "";
            return acc;
        }, {} as Record<string, string>)
    );

	const fieldsRef = useRef<Record<string, ValidatedRef | null>>({});
    
    const handleChange = (name: string, value: string) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

	const validateAndSubmit = () => {
		const isValid = validate();
        return isValid;
	}

	const validate = () => {
		const validationResults = Object.values(fieldsRef.current).map((field) => field?.validate());
  		return validationResults.every((result) => result);
	}

    const getData = () => {
        return formData;
    }

    useImperativeHandle(ref, () => ({
        validateAndSubmit,
        getData
    }));

    return (
		<Box component="form">
            {
                fields.map(
                    (field, index) => {
                        switch(field.type || "") {
                            case "dropdown":
                                return (
                                    <ValidatedDropdown
                                        key={index}
                                        name={field.name}
                                        label={field.label}
                                        value={formData[field.name]}
                                        options={field.options || []}
                                        onChange={handleChange}
                                        ref={(el) => (fieldsRef.current[field.name] = el)}
                                        required={field.required}
                                        validators={field.validator}
                                    />
                                )
                                break;
                            default:
                                return (
                                    <ValidatedTextField
                                        key={index}
                                        name={field.name}
                                        label={field.label}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        ref={(el) => (fieldsRef.current[field.name] = el)}
                                        required={field.required}
                                        readOnly={field.readonly}
                                        validators={field.validator}
                                    />
                                )
                        }
                    }
                )
            }
		</Box>
    );
});

export default DynamicForm;
