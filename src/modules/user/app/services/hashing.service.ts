import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class HashingService {
  async hash(plainText: string): Promise<string> {
    const salt = await genSalt(5);
    return hash(plainText, salt);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return compare(plainText, hashedText);
  }
}
