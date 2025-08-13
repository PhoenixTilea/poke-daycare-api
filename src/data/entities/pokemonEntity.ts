import type {Relation} from "typeorm";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import Trainer from "./trainerEntity";
import Move from "./moveEntity";

@Entity("Pokemon")
export default class PokemonEntity {
  @PrimaryGeneratedColumn()
  registrationId: number = 0;

  @Column()
  pokemonId: number = 1;

  @Column({nullable: true})
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
