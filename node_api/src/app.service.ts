import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';

@Injectable()
export class AppService {
  async getLocations(): Promise<object[]> {
    const data = await readFile('../win_locations_zakarpattia.json', 'utf-8');
    return JSON.parse(data);
  }
}
