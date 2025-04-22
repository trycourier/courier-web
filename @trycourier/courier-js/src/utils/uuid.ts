export class UUID {

  static generate(): string {
    return 'request_' + Math.random().toString(36).substring(2, 15);
  }

}