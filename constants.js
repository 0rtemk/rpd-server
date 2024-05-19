const COOKIE_SETTINGS = {
  REFRESH_TOKEN: {
    httpOnly: true,
    maxAge: 1296e6, // 15 * 24 * 3600 * 1000 (15 дней)
  },
};

const ACCESS_TOKEN_EXPIRATION = 18e5; // 1800 * 1000 (30 минут)

module.exports = {
  COOKIE_SETTINGS,
  ACCESS_TOKEN_EXPIRATION
}
