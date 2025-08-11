import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import Pokemon from "./pokemon";

@Entity()
export default class Trainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Pokemon, (pokemon) => pokemon.trainer)
  registeredPokemon: Pokemon[];
}
