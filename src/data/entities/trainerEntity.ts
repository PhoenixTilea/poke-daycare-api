import type { Relation } from "typeorm";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Pokemon from "./pokemonEntity";

@Entity("Trainers")
export default class TrainerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  username!: string;

  @Column("text")
  password!: string;

  @OneToMany(() => Pokemon, pokemon => pokemon.trainer)
  registeredPokemon!: Relation<Pokemon[]>;

  @Column({ type: "boolean", default: false })
  hasEgg!: boolean;
}
