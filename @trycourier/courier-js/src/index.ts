/*

     ,gggg,
   ,88"""Y8b,
  d8"     `Y8
 d8'   8b  d8                                      gg
,8I    "Y88P'                                      ""
I8'             ,ggggg,    gg      gg   ,gggggg,   gg    ,ggg,    ,gggggg,
d8             dP"  "Y8ggg I8      8I   dP""""8I   88   i8" "8i   dP""""8I
Y8,           i8'    ,8I   I8,    ,8I  ,8'    8I   88   I8, ,8I  ,8'    8I
`Yba,,_____, ,d8,   ,d8'  ,d8b,  ,d8b,,dP     Y8,_,88,_ `YbadP' ,dP     Y8,
  `"Y8888888 P"Y8888P"    8P'"Y88P"`Y88P      `Y88P""Y8888P"Y8888P      `Y8

===========================================================================

 More about Courier: https://courier.com
 TypeScript/JavaScript Documentation: https://github.com/trycourier/courier-web/tree/main/@trycourier/courier-js

===========================================================================

*/

// Types
import { CourierApiUrls } from './types/courier-api-urls';
import { CourierBrand } from './types/brands';
import {
  CourierUserPreferences,
  CourierUserPreferencesStatus,
  CourierUserPreferencesChannel,
  CourierUserPreferencesPaging,
  CourierUserPreferencesTopic,
  CourierUserPreferencesTopicResponse,
} from './types/preference';
import { CourierDevice, CourierToken } from './types/token';
import {
  CourierGetInboxMessageResponse,
  CourierGetInboxMessagesResponse,
  InboxMessage,
  InboxAction,
} from './types/inbox';
import { CourierSocket } from './socket/courier-socket';
import { MessageEvent, MessageEventEnvelope } from './types/socket/protocol/v1/messages';

// Client
import { CourierClient, CourierClientOptions, CourierProps } from './client/courier-client';
import { BrandClient } from './client/brand-client';
import { TokenClient } from './client/token-client';
import { PreferenceClient } from './client/preference-client';
import { InboxClient } from './client/inbox-client';
import { ListClient } from './client/list-client';

export type {
  CourierProps,
  CourierClientOptions,
  CourierBrand,
  CourierApiUrls,
  CourierUserPreferences,
  CourierUserPreferencesStatus,
  CourierUserPreferencesChannel,
  CourierUserPreferencesPaging,
  CourierUserPreferencesTopic,
  CourierUserPreferencesTopicResponse,
  CourierDevice,
  CourierToken,
  CourierGetInboxMessageResponse,
  CourierGetInboxMessagesResponse,
  InboxMessage,
  InboxAction,
  MessageEventEnvelope,
};

export {
  MessageEvent,
};

export {
  CourierClient,
  BrandClient,
  TokenClient,
  PreferenceClient,
  InboxClient,
  ListClient,
  CourierSocket
};

// Listeners
import { AuthenticationListener } from './shared/authentication-listener';
export type { AuthenticationListener };

// Shared
import { Courier } from './shared/courier';
export { Courier };