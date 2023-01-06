import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Issue as PIssue } from '@prisma/client';
import {
  GetIssuesDto,
  IExtendedIssue,
  IExtendedRawIssue,
  GetIssueQuery,
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
    issue: any,
    image: Express.Multer.File,
  ) {
    const upload = await this.storageService.upload(image, {
      resize: { width: 1080 },
    });
    return await this.issueRepository.create(userId, issue, upload);
  }

  public async findSampleIssues() {
    // const rawIssues = await this.issueRepository.find
  }

  public async findAllIssues(
    userId: string,
    getIssuesDto: GetIssuesDto,
    count: number = undefined,
  ) {
    const DISTANCE = 500; //임시: 조회 반경 (km)
    const rawIssues = await this.issueRepository.findManyInSquareByLatLng(
      getIssuesDto.lat,
      getIssuesDto.lng,
      DISTANCE,
      getIssuesDto.categories,
      count,
    );
    if (rawIssues.length == 0) return [];

    const iIssues = rawIssues.map((issue) =>
      this.formatRawIssue(userId, issue),
    );

    return { message: '사용자 주변 이슈 목록', data: { issues: iIssues } };
  }

  public async findIssueById(
    userId: string,
    issueId: number,
    field?: GetIssueQuery,
  ) {
    const rawIssue = await this.issueRepository.findOneById(issueId);
    if (!rawIssue) throw new NotFoundException('그런 이슈는 없어용');

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
