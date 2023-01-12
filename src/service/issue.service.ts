import { Injectable, NotFoundException } from '@nestjs/common';
import { IssueStatus } from '@prisma/client';
import { CreateImageDto } from 'src/common/interface/dto/image.dto';
import {
  CreateIssueBody,
  GetIssuesQuery,
} from 'src/common/interface/dto/issue.dto';
import IssueRepository from 'src/repository/issue.repository';
import { rawIssueToDto } from 'src/common/util/issue';
import { rawSolutionToDto } from 'src/common/util/solution';
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
    const created = await this.issueRepository.create(userId, issue, upload);

    return {
      message: '이슈를 등록하였습니다.',
      data: {
        id: created.id,
        createdAt: created.createdAt,
      },
    };
  }

  public async updateIssueStatus(issueId, status: IssueStatus) {
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

  public async findMyIssues(userId: string) {
    const [rawUnsolveds, rawPendings, rawSolveds] = await Promise.allSettled([
      await this.issueRepository.findManyByUserId(userId),
      await this.issueRepository.findByUserIdWithSolution(userId, 'PENDING'),
      await this.issueRepository.findByUserIdWithSolution(userId, 'SOLVED'),
    ]).then((result) => {
      return result.map((r) => {
        return r.status == 'fulfilled' ? r.value : [];
      });
    });

    const unsolveds =
      rawUnsolveds.length !== 0
        ? rawUnsolveds.map((r) => rawIssueToDto(userId, r))
        : [];
    const pendings =
      rawPendings.length !== 0
        ? rawPendings
            .map((r) => {
              const { solutions, ...issue } = r;
              return {
                issue: rawIssueToDto(userId, issue),
                solution: rawSolutionToDto(userId, solutions[0]),
              };
            })
            .filter(({ issue, solution }) => issue && solution)
        : [];
    const solveds =
      rawSolveds.length !== 0
        ? rawSolveds
            .map((r) => {
              const { solutions, ...issue } = r;
              return {
                issue: rawIssueToDto(userId, issue),
                solution: rawSolutionToDto(userId, solutions[0]),
              };
            })
            .filter(({ issue, solution }) => issue && solution)
        : [];

    return {
      message: `my issues`,
      data: {
        unsolveds,
        pendings,
        solveds,
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
      categories: undefined,
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
}
