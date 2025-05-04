import { QueryRunner } from 'typeorm';

export const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    update: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    insert: jest.fn(),
  },
} as unknown as QueryRunner;

export const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};
