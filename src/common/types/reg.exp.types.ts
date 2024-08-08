export const pwdRegExp = new RegExp(
    '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=<>,./?;:‘“|~`{}\\[\\]-])[a-zA-Z0-9!@#$%^&*()_+=<>,./?;:‘“|~`{}\\[\\]-]{8,}$',
);

export const emailRegExp = new RegExp(
    '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
);

export const PhoneNumberRegExp = new RegExp('^[0-9]{11}$');

export const userNameRegExp = new RegExp('^[a-z0-9]{6,20}$');
