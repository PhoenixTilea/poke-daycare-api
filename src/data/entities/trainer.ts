import type {Relation} from "typeorm";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Pokemon from "./pokemon";

@Entity("Trainers")
export default class TrainerEntity {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  username: string = "";

  @Column()
  password: string = "";

  @OneToMany(() => Pokemon, (pokemon) => pokemon.trainer)
  registeredPokemon: Relation<Pokemon[]> = [];
}
