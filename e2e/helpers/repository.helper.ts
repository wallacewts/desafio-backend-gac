import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import dataSource from '../../src/ormconfig';

@Injectable()
export class RepositoryHelper {
  async loadDataSource(): Promise<DataSource> {
    return dataSource.initialize();
  }

  readonly createTruncateTable =
    (dataSource: DataSource) =>
    async (...tableName: string[]): Promise<void> => {
      if (dataSource) {
        await dataSource.transaction(async (m) => {
          for (const table of new Set(tableName.map((t) => t.trim()))) {
            await m.queryRunner?.query(
              `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`,
            );
          }
        });
      }
    };
}
