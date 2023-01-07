import { Injectable } from '@nestjs/common';
import SolutionRepository from 'src/repository/solution.repository';

@Injectable()
export class SolutionService {
  constructor(private readonly solutionRepository: SolutionRepository) {}

  async createSolution() {}
}
