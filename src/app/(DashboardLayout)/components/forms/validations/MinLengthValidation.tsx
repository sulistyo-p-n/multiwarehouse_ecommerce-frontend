
export const MinLengthValidation = (minLength: number) => {
    return (value: string): string | true => {
        return (value.length < minLength) ? "must be at least " + minLength + " character" + (minLength > 1 ? "s" : "") + " long" : true;
    };
};
