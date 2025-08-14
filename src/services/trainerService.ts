import bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import type { Repository } from "typeorm";
import { ITrainerService, trainerRepositoryId } from "../contracts";
import type TrainerEntity from "../data/entities/trainerEntity";
import UsernameUnavailableError from "../errors/usernameUnavailableError";

@injectable()
export default class TrainerService implements ITrainerService {
  constructor(
    @inject(trainerRepositoryId)
    private readonly _trainerRepository: Repository<TrainerEntity>,
  ) {}

  public authenticateTrainer = async (username: string, password: string) => {
    const trainer = await this._trainerRepository.findOneBy({ username });

    if (trainer) {
      return bcrypt.compare(password, trainer.password);
    }

    return false;
  };

  public registerNewTrainer = async (username: string, password: string) => {
    const nameIsTaken = await this._trainerRepository.existsBy({ username });
    if (nameIsTaken) {
      throw new UsernameUnavailableError(username);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const trainer = await this._trainerRepository.create({
      username,
      password: hashedPassword,
    });
    await this._trainerRepository.save(trainer);
  };

  public addStepsToTrainer = async (username: string, steps: number) => {
    const trainer = await this.getTrainer(username);
    trainer.registeredPokemon.forEach(p => {
      p.exp += steps;
    });
    await this._trainerRepository.save(trainer);
  };

  private getTrainer = async (
    username: string,
  ): Promise<Omit<TrainerEntity, "password">> => {
    const trainer = this._trainerRepository.findOneOrFail({
      select: { username: true, registeredPokemon: true },
      where: { username },
    });

    return trainer;
  };
}
