import * as bcrypt from 'bcrypt';

export class HashHelper {
  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async hash(data: string): Promise<string> {
    const salt =  10;; // Generate salt
    return bcrypt.hash(data, salt); // Hash the data with the salt
  }

  // Method to compare a given string with a hash
  async compare(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData); // Compare data with hashedData
  }
}
