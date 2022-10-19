import User from '@/resources/user/user.interface';
import {
    AccessToken,
    AccessTokenPayload,
    RefreshToken,
    RefreshTokenPayload,
} from '@/utils/interfaces/token.interface';
import jwt from 'jsonwebtoken';
import { config } from './config';

enum TokenExpiration {
    Access = 5 * 60,
    Refresh = 7 * 24 * 60 * 60,
    RefreshIfLessThan = 4 * 24 * 60 * 60,
}

function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, config.accessTokenSecret as jwt.Secret, {
        expiresIn: TokenExpiration.Access,
    });
}

function signRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, config.refreshTokenSecret as jwt.Secret, {
        expiresIn: TokenExpiration.Refresh,
    });
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, config.refreshTokenSecret) as RefreshToken;
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, config.accessTokenSecret) as AccessToken;
}

export function buildTokens(user: User) {
    const accessPayload: AccessTokenPayload = { userId: user._id };
    const refreshPayload: RefreshTokenPayload = {
        userId: user._id,
        version: user.tokenVersion,
    };

    const accessToken = signAccessToken(accessPayload);
    const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
}

export function refreshTokens(current: RefreshToken, tokenVersion: number) {
    if (tokenVersion !== current.version) throw 'Token revoked';

    const accessPayload: AccessTokenPayload = { userId: current.userId };
    let refreshPayload: RefreshTokenPayload | undefined;

    const expiration = new Date(current.exp * 1000);
    const now = new Date();
    const secondsUntilExpiration =
        (expiration.getTime() - now.getTime()) / 1000;

    if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
        refreshPayload = { userId: current.userId, version: tokenVersion };
    }

    const accessToken = signAccessToken(accessPayload);
    const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
}
