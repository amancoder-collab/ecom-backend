export class ApiError {
    static SUCCESS_MESSAGE = 'success';
    static UNAUTHORIZED_MESSAGE = 'Unauthorized';
    static INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';
    static BAD_REQUEST = 'Bad request';
    static NOT_FOUND = 'Not found';
}

export class ClientLogError {
    static ONLY_SELLER = 'only seller can allow';
    static USER_NOT_FOUND = 'user not found';
    static PRODUCT_NOT_FOUND = 'product not found';
    static QUANTITY_CANT_BE_ZERO = 'quantity must be greater than zero';
    static CART_NOT_EXIST = 'cart does not exit';
}
