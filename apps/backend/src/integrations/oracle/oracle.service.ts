import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import oracledb from 'oracledb';

@Injectable()
export class OracleService implements OnModuleInit, OnModuleDestroy {
  private pool: oracledb.Pool | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.pool = await oracledb.createPool({
      user: this.config.get<string>('ORACLE_USER'),
      password: this.config.get<string>('ORACLE_PASSWORD'),
      connectString: this.config.get<string>('ORACLE_CONNECT_STRING'),
      poolMin: Number(this.config.get<string>('ORACLE_POOL_MIN') ?? 1),
      poolMax: Number(this.config.get<string>('ORACLE_POOL_MAX') ?? 8),
      poolIncrement: Number(this.config.get<string>('ORACLE_POOL_INCREMENT') ?? 1),
    });
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.close(10);
      this.pool = null;
    }
  }

  private requirePool(): oracledb.Pool {
    if (!this.pool) {
      throw new Error('Oracle pool not initialized');
    }
    return this.pool;
  }

  async execute<T = Record<string, unknown>>(
    sql: string,
    binds: oracledb.BindParameters = {},
    options: oracledb.ExecuteOptions = {},
  ): Promise<T[]> {
    const connection = await this.requirePool().getConnection();
    try {
      const result = await connection.execute<T>(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: false,
        ...options,
      });
      return (result.rows ?? []) as T[];
    } finally {
      await connection.close();
    }
  }

  async executeDml(
    sql: string,
    binds: oracledb.BindParameters = {},
    options: oracledb.ExecuteOptions = {},
  ): Promise<oracledb.Result<unknown>> {
    const connection = await this.requirePool().getConnection();
    try {
      return await connection.execute(sql, binds, {
        autoCommit: true,
        ...options,
      });
    } finally {
      await connection.close();
    }
  }

  async withTransaction<T>(
    fn: (connection: oracledb.Connection) => Promise<T>,
  ): Promise<T> {
    const connection = await this.requirePool().getConnection();
    try {
      const result = await fn(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.close();
    }
  }
}
