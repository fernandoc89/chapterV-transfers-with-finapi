import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTransfers1623442586324 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: "transfers",
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true
          },
          {
            name: 'sender_id',
            type: 'uuid',
          },
          {
            name: "amount",
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ],
        foreignKeys: [
          {
            name: 'FKSenderId',
            columnNames: ['sender_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          }
        ]
      }))
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('transfers');
    }

}
