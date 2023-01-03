import { Injectable } from '@nestjs/common';
import SolutionRepository from 'src/repository/solution.repository';

@Injectable()
export class SolveService {
  constructor(private readonly solutionRepository: SolutionRepository) {}

  async createSolution() {
    const solution = this.solutionRepository.create();
  }
}
