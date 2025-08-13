import type {Relation} from "typeorm";
import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import Pokemon from "./pokemonEntity";

@Entity("Trainers")
export default class TrainerEntity {
  @PrimaryColumn()
  username: string = "";

  @Column()
  password: string = "";

  @OneToMany(() => Pokemon, (pokemon) => pokemon.trainer)
  registeredPokemon: Relation<Pokemon[]> = [];
}
