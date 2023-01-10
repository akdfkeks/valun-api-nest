import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateImageDto } from 'src/interface/dto/image.dto';
import {
  CreateRejectionBody,
  CreateSolutionBody,
} from 'src/interface/dto/solution.dto';
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
    const {
      data: { issue },
    } = await this.issueService.findIssueById(userId, solutionBody.issueId);
    /*
     * 이슈와의 거리도 계산 - 보류
     * 제보자에게 판단을 맡길것인가?
     */
    if (!issue || issue.status !== 'UNSOLVED')
      throw new BadRequestException('해결 시도가 불가능한 이슈입니다.');
    // 같으면 에러가 나야함
    this.checkPermit(userId, issue.userId, false);

    this.storageService
      .upload(image, { resize: { width: 1080 } })
      .then((uploaded) => {
        Promise.all([
          this.solutionRepository.create(userId, solutionBody, uploaded),
          this.issueService.updateIssueStatus(issue.id, 'PENDING'),
        ])
          .then(([solution, issue]) => {})
          .catch((err) => {
            console.log(err);
            throw err;
          });
      });

    return { message: '해결 등록 성공', data: {} };
  }

  async acceptSolution(userId: string, solutionId: number) {
    const solution = await this.solutionRepository.findOneById(solutionId);
    // 이걸 비교하는것보다 그냥 userid 로 solution 이 달린 이슈를 검색해봐?
    if (!solution || solution.issue.status !== 'PENDING')
      throw new BadRequestException('잘못된 요청입니다.');
    // 다르면 에러가 나야함;
    this.checkPermit(userId, solution.issue.userId, true);

    this.issueService
      .updateIssueStatus(solution.issueId, 'SOLVED')
      .then((result) => {
        // 빗자루
      })
      .catch((err) => {});

    return {
      message: `Issue ID : ${solution.issueId} 에 대한 해결 요청을 수락하였습니다.`,
      data: {},
    };
  }

  public async rejectSolution(
    user: string,
    id: number,
    rejection: CreateRejectionBody,
  ) {
    return { message: 'reject', data: {} };
  }

  private checkPermit(requester: string, owner: string, same: boolean) {
    if (!(requester == owner || same))
      throw new UnauthorizedException('권한이 없습니다.');
  }

  private checkSolutionPermit() {}

  // private checkDistance(
  //   a: { lat: number; lng: number },
  //   b: { lat: number; lng: number },
  // ) {
  //   const KMPERLAT = 0.00899361453;
  //   const KMPERLNG = 0.01126126126;
  // }
}
