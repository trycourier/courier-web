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
import { CourierBrandResponse } from './types/brand';
import { CourierApiUrls } from './types/courier-api-urls';
export type {
  CourierClientOptions,
  CourierBrandResponse,
  CourierApiUrls
};

// Client
import { CourierClient, CourierClientOptions } from './client/courier-client';
import { BrandClient } from './client/brand-client';
export {
  CourierClient,
  BrandClient
};

// Default export
export default CourierClient;