
export const MaxLengthValidation = (maxLength: number) => {
    return (value: string): string | true => {
        return (value.length > maxLength) ? "must be less than " + maxLength + " character" + (maxLength > 1 ? "s" : "") + " long" : true;
    };
};
