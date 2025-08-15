import bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import type { Repository } from "typeorm";
import { ITrainerService, trainerRepositoryId } from "../contracts";
import type TrainerEntity from "../data/entities/trainerEntity";
import { UsernameUnavailableError } from "../errors";

@injectable()
export default class TrainerService implements ITrainerService {
  constructor(
    @inject(trainerRepositoryId)
    private readonly _trainerRepository: Repository<TrainerEntity>,
  ) {}

  public authenticateTrainer = async (username: string, password: string) => {
    const trainer = await this._trainerRepository.findOne({
      select: { username: true, password: true },
      where: { username },
    });

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
      registeredPokemon: [],
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

  private getTrainer = (
    username: string,
  ): Promise<Omit<TrainerEntity, "password">> => {
    return this._trainerRepository.findOneOrFail({
      relations: { registeredPokemon: true },
      select: { username: true, registeredPokemon: true },
      where: { username },
    });
  };
}
