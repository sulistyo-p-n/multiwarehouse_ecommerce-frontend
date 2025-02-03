
import { RegexValidation } from "./RegexValidation";

export const NameValidation = () => {
    return RegexValidation(/^[a-zA-Z0-9 ]+$/, "must contain only letters, numbers and spaces");
};
