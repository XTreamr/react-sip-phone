/// <reference types="react" />
import { AppConfig, PhoneConfig, SipConfig, SipCredentials } from './models';
export declare const phoneStore: import("redux").Store<import("redux-persist/es/persistReducer").PersistPartial, import("redux").Action<any>> & {
    dispatch: unknown;
};
interface Props {
    width: number;
    height: number;
    name: string;
    phoneConfig: PhoneConfig;
    sipCredentials: SipCredentials;
    sipConfig: SipConfig;
    appConfig: AppConfig;
    containerStyle: any;
    children: any;
}
export declare const SIPProvider: ({ name, phoneConfig, sipConfig, appConfig, sipCredentials, containerStyle, children }: Props) => JSX.Element;
export declare const useSip: () => {};
export {};
