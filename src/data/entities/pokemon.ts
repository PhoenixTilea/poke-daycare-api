import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import Trainer from "./trainer";

@Entity()
export default class Pokemon {
  @PrimaryGeneratedColumn()
  registrationId: number;

  @Column()
  pokemonId: number;

  @ManyToOne(() => Trainer, (trainer) => trainer.registeredPokemon)
  trainer: Trainer;

  @Column()
  isFemale: boolean;

  @Column()
  level: number;
}
