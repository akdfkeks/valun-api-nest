import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateImageDto } from 'src/interface/dto/image.dto';
import {
  CreateIssueBody,
  GetIssuesQuery,
  IExtendedIssue,
  IExtendedRawIssue,
} from 'src/interface/dto/issue.dto';
import IssueRepository from 'src/repository/issue.repository';
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
    const rawIssues = await this.issueRepository.findMany({});
    if (rawIssues.length == 0) return [];

    const iIssues = rawIssues.map((issue) => this.formatRawIssue(null, issue));

    return {
      message: `최근 제보된 ${iIssues.length}건의 이슈`,
      data: { issues: iIssues },
    };
  }

  public async findNearbyIssues(userId: string, getIssuesDto: GetIssuesQuery) {
    const rawIssues = await this.issueRepository.findMany({ ...getIssuesDto });
    if (rawIssues.length == 0) return [];

    const iIssues = rawIssues.map((issue) =>
      this.formatRawIssue(userId, issue),
    );

    return { message: '사용자 주변 이슈 목록', data: { issues: iIssues } };
  }

  public async findIssueById(userId: string, issueId: number) {
    const rawIssue = await this.issueRepository.findOneById(issueId);
    if (!rawIssue) throw new NotFoundException('존재하지 않는 이슈입니다.');

    const issue = this.formatRawIssue(userId, rawIssue);

    return { message: '단일 이슈', data: { issue } };
  }

  public async findIssuesByUserId(userId: string) {
    let issues: IExtendedIssue[] = [];

    const rawIssues = await this.issueRepository.findManyByUserId(userId);
    if (rawIssues.length !== 0)
      rawIssues.map((issue) => this.formatRawIssue(userId, issue));

    return { message: '', data: { issues } };
  }

  private formatRawIssue(
    userId: string,
    rawIssue: IExtendedRawIssue,
  ): IExtendedIssue {
    const { issueCategoryId, category, image, ...rest } = rawIssue;

    const extended: IExtendedIssue = {
      ...rest,
      category: category ? category.name : 'any',
      imageUrl: image ? image.location : '기본 이미지 Url',
      isMine: userId == rawIssue.userId ? true : false,
    };

    return extended;
  }
}
