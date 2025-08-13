import type {Relation} from "typeorm";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import Trainer from "./trainer";
import Move from "./move";

@Entity("RegisteredPokemon")
export default class RegisteredPokemonEntity {
  @PrimaryGeneratedColumn()
  registrationId: number = 0;

  @Column()
  pokemonId: number = 1;

  @Column()
  nickname?: string;

  @ManyToOne(() => Trainer, (trainer) => trainer.registeredPokemon)
  trainer: Relation<Trainer> = new Trainer();

  @Column()
  isFemale: boolean = false;

  @Column()
  exp: number = 0;

  @Column()
  levelAtLastCheck: number = 1;

  @Column()
  hasEgg: boolean = false;

  @ManyToMany(() => Move)
  @JoinTable()
  moves: Move[] = [];
}
