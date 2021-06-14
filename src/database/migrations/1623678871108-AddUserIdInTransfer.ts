import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddUserIdInTransfer1623678871108 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn("transfers",
      new TableColumn({
        name: "user_id",
        type: "uuid",
        isNullable: true
      })
    )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("transfers", "user_id")
    }

}
