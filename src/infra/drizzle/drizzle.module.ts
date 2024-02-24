import { Module } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { ConnectionService } from './connection.service';

@Module({
  providers: [MigrationService, ConnectionService],
  exports: [MigrationService, ConnectionService],
})
export class DrizzleModule {}
