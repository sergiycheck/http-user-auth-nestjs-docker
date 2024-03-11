import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

@Injectable()
export class ConnectionService {
  db: PostgresJsDatabase<typeof schema>;
  constructor(private configService: ConfigService) {
    const connectionString = configService.get<string>('DB_CONNECTION_STRING');

    const queryClient = postgres(connectionString);
    this.db = drizzle(queryClient, { schema });
  }
}
