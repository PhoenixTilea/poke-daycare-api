import type {Relation} from "typeorm";
import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import Pokemon from "./pokemonEntity";

@Entity("Trainers")
export default class TrainerEntity {
  @PrimaryColumn()
  username: string = "";

  @Column()
  password: string = "";

  @Column()
  steps: number = 0;

  @OneToMany(() => Pokemon, (pokemon) => pokemon.trainer)
  registeredPokemon: Relation<Pokemon[]> = [];

  @Column()
  hasEgg: boolean = false;
}
