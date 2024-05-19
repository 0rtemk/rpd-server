const AuthService = require("../services/Auth.js");
const { ErrorUtils } = require("../utils/Errors.js");
const { COOKIE_SETTINGS } = require("../../constants.js");

class AuthController {
  static async signIn(req, res) {
    const { userName, password } = req.body;
    const { fingerprint } = req;
    try {
      const { fullname, role, accessToken, refreshToken, accessTokenExpiration } =
        await AuthService.signIn({
          userName,
          password,
          fingerprint,
        });

      res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

      return res.status(200).json({ fullname, role, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async signUp(req, res) {
    const { userName, password, role } = req.body;
    const { fingerprint } = req;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await AuthService.signUp({
          userName,
          password,
          role,
          fingerprint,
        });

      res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

      return res.status(200).json({ fullname, role, accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async logOut(req, res) {
    const refreshToken = req.cookies.refreshToken;
    try {
      await AuthService.logOut(refreshToken);

      res.clearCookie("refreshToken");

      return res.sendStatus(200);
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }

  static async refresh(req, res) {
    const { fingerprint } = req;
    const currentRefreshToken = req.cookies.refreshToken;

    try {
      const { accessToken, refreshToken, accessTokenExpiration } =
        await AuthService.refresh({
          currentRefreshToken,
          fingerprint,
        });

      res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

      return res.status(200).json({ accessToken, accessTokenExpiration });
    } catch (err) {
      return ErrorUtils.catchError(res, err);
    }
  }
}

module.exports = AuthController;
