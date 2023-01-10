import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateImageDto } from 'src/interface/dto/image.dto';
import {
  CreateIssueBody,
  GetIssuesQuery,
  IIssue,
  IExtendedRawIssue,
} from 'src/interface/dto/issue.dto';
import IssueRepository from 'src/repository/issue.repository';
import { rawIssueToDto } from 'src/util/issue';
import { rawSolutionToDto } from 'src/util/solution';
// import { toDto } from 'src/util/issue';
import { StorageService } from './storage.service';

@Injectable()
export class IssueService {
  constructor(
    private issueRepository: IssueRepository,
    private storageService: StorageService,
  ) {}

  public async createIssue(
    userId: string,
    issue: CreateIssueBody,
    image: Express.Multer.File,
  ) {
    const upload: CreateImageDto = await this.storageService.upload(image, {
      resize: { width: 1080 },
    });
    return await this.issueRepository.create(userId, issue, upload);
  }

  public async updateIssueStatus(issueId, status) {
    return await this.issueRepository.updateOne({ id: issueId, status });
  }

  public async findSampleIssues() {
    const rawIssues = await this.issueRepository.findMany({
      status: 'UNSOLVED',
      take: 5,
    });
    if (rawIssues.length == 0) return [];

    const iIssues = rawIssues.map((issue) => rawIssueToDto(null, issue));

    return {
      message: `최근 제보된 ${iIssues.length}건의 이슈`,
      data: { issues: iIssues },
    };
  }

  public async findPendingIssues(userId: string) {
    const pendings = await this.issueRepository.findByUserIdWithSolution(
      userId,
    );
    let pd = [];
    if (pendings.length > 0) {
      pd = pendings
        .map((e) => {
          const { solutions, ...issue } = e;
          return {
            issue: rawIssueToDto(userId, issue),
            solution: rawSolutionToDto(userId, solutions[0]),
          };
        })
        .filter(({ issue, solution }) => issue && solution);
    }
    return {
      message: '되노',
      data: {
        pendings: pd,
      },
    };
  }

  public async findRecentIssues(
    userId: string,
    getIssuesQuery: GetIssuesQuery,
  ) {
    let r = [];
    const rawIssues = await this.issueRepository.findMany({
      ...getIssuesQuery,
      status: 'UNSOLVED',
      take: 10,
    });
    if (rawIssues.length !== 0)
      r = rawIssues.map((issue) => rawIssueToDto(userId, issue));

    return { message: '사용자 주변 최근 이슈 목록', data: { issues: r } };
  }

  public async findNearbyIssues(userId: string, getIssuesDto: GetIssuesQuery) {
    let r = [];
    const rawIssues = await this.issueRepository.findMany({
      ...getIssuesDto,
      status: 'UNSOLVED',
    });
    if (rawIssues.length !== 0)
      r = rawIssues.map((issue) => rawIssueToDto(userId, issue));

    return { message: '사용자 주변 이슈 목록', data: { issues: r } };
  }

  public async findIssueById(userId: string, issueId: number) {
    const rawIssue = await this.issueRepository.findOneById(issueId);
    if (!rawIssue) throw new NotFoundException('존재하지 않는 이슈입니다.');

    const issue = rawIssueToDto(userId, rawIssue);

    return { message: '단일 이슈', data: { issue } };
  }

  public async findIssuesByUserId(userId: string) {
    let issues: IIssue[] = [];

    const rawIssues = await this.issueRepository.findManyByUserId(userId);
    if (rawIssues.length !== 0)
      rawIssues.map((issue) => rawIssueToDto(userId, issue));

    return { message: '', data: { issues } };
  }
}
