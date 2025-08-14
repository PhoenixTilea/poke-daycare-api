import type {Relation} from "typeorm";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Trainer from "./trainerEntity";

@Entity("Pokemon")
export default class PokemonEntity {
  @PrimaryGeneratedColumn()
  registrationId!: number;

  @Column("int")
  pokemonId!: number;

  @Column({
    type: "text",
    nullable: true
  })
  nickname?: string;

  @ManyToOne(() => Trainer, (trainer) => trainer.registeredPokemon)
  trainer!: Relation<Trainer>;

  @Column({
    type: "boolean",
    default: false
  })
  isFemale!: boolean;

  @Column({
    type: "int",
    update: false
  })
  levelAtRegistration!: number;

  @Column("int")
  exp!: number;

  @Column("simple-array")
  moves!: string[];
}
