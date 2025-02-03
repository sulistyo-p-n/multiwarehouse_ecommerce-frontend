
export const RegexValidation = (regex: RegExp, failedMessage: string) => {
    return (value: string): string | true => {
        return (!regex.test(value)) ? failedMessage : true;
    };
};
