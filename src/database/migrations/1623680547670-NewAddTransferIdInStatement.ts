import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class NewAddTransferIdInStatement1623680547670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.addColumn("statements",
  new TableColumn({
    name: "transfer_id",
    type: "uuid",
    isNullable: true
  })
)
}

public async down(queryRunner: QueryRunner): Promise<void> {
}

}
