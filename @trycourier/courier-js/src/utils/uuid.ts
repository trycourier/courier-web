export class UUID {

  private static readonly ALPHABET = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

  /**
   * nanoid
   * Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>
   *
   * https://github.com/ai/nanoid/blob/main/LICENSE
   *
   * @param size - The size of the UUID to generate.
   * @returns A string representing the UUID.
   */
  static nanoid(size: number = 21): string {
    let id = '';
    let bytes = crypto.getRandomValues(new Uint8Array((size |= 0)));

    while (size--) {
      // Using the bitwise AND operator to "cap" the value of
      // the random byte from 255 to 63, in that way we can make sure
      // that the value will be a valid index for the "chars" string.
      id += UUID.ALPHABET[bytes[size] & 63]
    }
    return id;
  }

}