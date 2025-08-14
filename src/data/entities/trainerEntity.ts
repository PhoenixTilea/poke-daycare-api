import type { Relation } from "typeorm";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import Pokemon from "./pokemonEntity";

@Entity("Trainers")
export default class TrainerEntity {
  @PrimaryColumn("text")
  username!: string;

  @Column("text")
  password!: string;

  @OneToMany(() => Pokemon, pokemon => pokemon.trainer, { cascade: true })
  registeredPokemon!: Relation<Pokemon[]>;
}
