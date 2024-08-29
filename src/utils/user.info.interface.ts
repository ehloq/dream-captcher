import {IUser} from '../database/user/user.model.js';

export interface UserInfo{
    clientIp: string;
    username: string;
    identifier: string;
    countryCode: string;
    config : IUser['config'];
    percent: number;
}