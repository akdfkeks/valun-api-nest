import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateImageDto } from 'src/interface/dto/image.dto';
import { CreateSolutionBody } from 'src/interface/dto/solution.dto';
import SolutionRepository from 'src/repository/solution.repository';
import { IssueService } from './issue.service';
import { StorageService } from './storage.service';

@Injectable()
export class SolutionService {
  constructor(
    private readonly solutionRepository: SolutionRepository,
    private readonly storageService: StorageService,
    private readonly issueService: IssueService,
  ) {}

  async createSolution(
    userId: string,
    solutionBody: CreateSolutionBody,
    image: Express.Multer.File,
  ) {
    /* 1. 먼저 해결하려는 이슈의 상태(존재, 제보자, 해결여부) 확인해야한다.
     * 2. 존재하지 않는다면, NotFoundException
     * 3. 존재한다면, 이미지를 업로드 후 solution 을 생성한다.
     */
    // 코드 개선하기
    const {
      data: { issue },
    } = await this.issueService.findIssueById(userId, solutionBody.issueId);
    // 이슈와의 거리도 계산해야 한다
    if (!issue || issue.status !== 'UNSOLVED' || issue.userId === userId)
      throw new BadRequestException('해결 시도가 불가능한 이슈입니다.');

    const upload: CreateImageDto = await this.storageService.upload(image, {
      resize: { width: 1080 },
    });

    const solution = await this.solutionRepository.create(
      userId,
      solutionBody,
      upload,
    );

    if (solution) this.issueService.updateIssueStatus(issue.id, 'PENDING');

    return { message: '해결 등록 성공', data: null };
  }
}
