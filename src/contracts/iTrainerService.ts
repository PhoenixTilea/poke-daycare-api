import type {ServiceIdentifier} from "inversify";

export interface ITrainerService {
  authenticateTrainer(username: string, password: string): Promise<boolean>;
  registerNewTrainer(username: string, password: string): Promise<void>;
  addStepsToTrainer(username: string, steps: number): Promise<void>;
}

export const trainerServiceId: ServiceIdentifier<ITrainerService> = Symbol.for("TrainerServiceId");