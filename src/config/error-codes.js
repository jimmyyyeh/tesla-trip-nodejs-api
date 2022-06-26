const errorCodes = {
  INTERNAL_SERVER_ERROR: 500,

  USER_NOT_EXIST: 1001,  // 使用者不存在
  USER_INVALIDATE: 1002,  // 使用者授權無效(密碼錯誤)
  USER_ALREADY_EXIST: 1003,  // 使用者已存在
  USER_UNVERIFIED: 1004,  // 使用者未驗證
  TOKEN_INVALIDATE: 1005,  // 無效授權
  TOKEN_EXPIRED: 1006,  // 授權逾時
  TOKEN_MISSING: 1007,  // headers 未帶授權
  TOKEN_TYPE_INVALIDATE: 1008, // token type 錯誤
  VERIFY_TOKEN_NOT_EXISTS: 1008,  // 驗證token不存在
  RESET_PASSWORD_TOKEN_NOT_EXISTS: 1009,  // 重設密碼token不存在
  RESET_PASSWORD_TOKEN_INVALIDATE: 1010,  // 重設密碼token錯誤
  ROLE_INVALIDATE: 1011,  // 身份不符

  PARAMETER_ERROR: 2001,  // 參數錯誤
  DATA_NOT_FOUND: 2022,  // 資料不存在
  REQUEST_DATA_ERROR: 2023, // 請求資料有誤
  METHOD_NOT_ALLOW: 2024, // 請求method錯誤
  URL_NOT_FOUND: 2025, // 請求url不存在

  INSUFFICIENT_POINT: 3001,  // 點數不足
  INSUFFICIENT_PRODUCT_STOCK: 3002,  // 庫存不足

};

module.exports = { errorCodes };
