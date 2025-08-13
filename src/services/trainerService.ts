import bcrypt from "bcrypt";
import {inject, injectable} from "inversify";
import type {Repository} from "typeorm";
import {ITrainerService, trainerRepositoryId} from "../contracts";
import type TrainerEntity from "../data/entities/trainerEntity";
import InvalidUsernameError from "../errors/invalidUsernameError";
import UsernameUnavailableError from "../errors/usernameUnavailableError";

@injectable()
export default class TrainerService implements ITrainerService {
  constructor(
    @inject(trainerRepositoryId)
    private readonly _trainerRepository: Repository<TrainerEntity>
  ) {}

  public authenticateTrainer = async (username: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const exists = await this._trainerRepository.existsBy({
      username,
      password: hashedPassword
    });

    return exists;
  }

  public registerNewTrainer = async (username: string, password: string) => {
    this.validateUsername(username);
    const nameIsTaken = await this._trainerRepository.existsBy({
      username
    });
    if (nameIsTaken) {
      throw new UsernameUnavailableError(username);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this._trainerRepository.create({
      username,
      password: hashedPassword
    });
  }

  public addStepsToTrainer = async (username: string, steps: number) => {
    const trainer = await this.getTrainer(username);
    trainer.registeredPokemon.forEach(p => {
      p.exp += steps;
    });
    await this._trainerRepository.save(trainer);
  }

  private getTrainer = async (username: string): Promise<Omit<TrainerEntity, "password">> => {
    const trainer = this._trainerRepository.findOneOrFail({
      select: {
        username: true,
        registeredPokemon: true
      },
      where: {
        username
      }
    });

    return trainer;
  }

  private validateUsername = (username: string) => {
    if (username.length === 0) {
      throw new InvalidUsernameError("Username cannot be empty or whitespace only.");
    } else if (/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new InvalidUsernameError("Username can only contain letters, numbers, and underscores (_).");
    }
  }
}
