import { useState, useEffect } from 'react';

const useFormValidation = (formData, validationRules) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValid, setIsValid] = useState(false);

    // Validate a specific field
    const validateField = (fieldName, value) => {
        const rules = validationRules[fieldName];
        if (!rules) return '';

        for (const rule of rules) {
            const errorMessage = rule(value, formData);
            if (errorMessage) {
                return errorMessage;
            }
        }
        return '';
    };

    // Validate all fields
    const validateAll = (data = formData) => {
        const newErrors = {};
        Object.keys(validationRules).forEach(fieldName => {
            const error = validateField(fieldName, data[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle field blur
    const handleBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
    };

    // Handle field change with validation
    const handleFieldChange = (fieldName, value) => {
        // Update error for this field immediately
        const error = validateField(fieldName, value);
        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));

        // Remove from touched if it becomes valid
        if (!error && touched[fieldName]) {
            setTouched(prev => {
                const newTouched = { ...prev };
                delete newTouched[fieldName];
                return newTouched;
            });
        }
    };

    // Check if field is valid
    const isFieldValid = (fieldName) => {
        return !errors[fieldName] && (touched[fieldName] || formData[fieldName]);
    };

    // Check if field has error
    const hasFieldError = (fieldName) => {
        return touched[fieldName] && errors[fieldName];
    };

    // Get field validation class
    const getFieldValidationClass = (fieldName) => {
        if (touched[fieldName]) {
            return errors[fieldName] 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-green-500 focus:ring-green-500 focus:border-green-500';
        }
        return 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    };

    // Update validation when formData changes
    useEffect(() => {
        const isValid = validateAll(formData);
        setIsValid(isValid);
    }, [formData]);

    return {
        errors,
        touched,
        isValid,
        validateField,
        validateAll,
        handleBlur,
        handleFieldChange,
        isFieldValid,
        hasFieldError,
        getFieldValidationClass
    };
};

export default useFormValidation;