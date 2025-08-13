import type {Relation} from "typeorm";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Pokemon from "./pokemonEntity";

@Entity("Trainers")
export default class TrainerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "text",
    unique: true
  })
  username!: string;

  @Column("text")
  password!: string;

  @Column({
    type: "int",
    default: 0
  })
  steps!: number;

  @OneToMany(() => Pokemon, (pokemon) => pokemon.trainer)
  registeredPokemon!: Relation<Pokemon[]>;

  @Column("boolean")
  hasEgg!: boolean;
}
