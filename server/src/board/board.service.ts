import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardService {
  private readonly store: Map<string, string> = new Map();

  set(key: string, value: string) {
    this.store.set(key, value);
  }

  get(key: string): string | null {
    if (this.store.has(key)) {
      return this.store.get(key);
    } else {
      return null;
    }
  }
}
