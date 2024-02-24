import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

@Injectable()
export class MigrationService {
  constructor(private configService: ConfigService) {}

  async migrate() {
    const connectionString = this.configService.get<string>('POSTGRES_URL');
    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    await migrate(db, { migrationsFolder: 'drizzle' });
  }
}
