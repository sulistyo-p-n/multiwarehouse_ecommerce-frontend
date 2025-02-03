
import { RegexValidation } from "./RegexValidation";

export const EmailValidation = () => {
    return RegexValidation(/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/, "invalid email address");
};
