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
  static INVALID_DATE = 'invalid date formate';
  static PRODUCT_NOT_FOUND = 'product not found';
  static QUANTITY_CANT_BE_ZERO = 'quantity must be greater than zero';
  static CART_NOT_EXIST = 'cart does not exit';
  static RATING_MUST_BE_VALID = 'rating must be 1 and below 5';
  static COUPON_ALREADY_USED = 'This coupon has already been used.';
  static COUPON_INVALID = 'coupon is invalid';
  static COUPON_NOT_ACTIVE = 'this coupon is no longer active';
  static COUPON_NOT_VALID_FOR_THIS_TIME =
    'this coupon is not valid at this time';
  static EXCEEDS_MAX_LIMIT =
    'the order amount is higher than the allowed limit for this coupon';
  static REQ_MIN_PURCHASE = 'to use this coupon amount must be at least';
  static COUPON_CODE_EXISTS = 'coupon code already exist ';
  static SOMETHING_WRONG = 'something went wrong try again ';
}
