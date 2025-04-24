export class UUID {

  static generate(prefix?: string): string {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return prefix ? prefix + id : id;
  }

}