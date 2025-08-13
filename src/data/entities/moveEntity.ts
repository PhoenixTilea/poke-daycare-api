import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity("Moves")
export default class MoveEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  name: string = "";
}
