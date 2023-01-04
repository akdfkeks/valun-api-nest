import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Issue as PIssue } from '@prisma/client';
import { IIssue, RawIssue } from 'src/dto/issue.dto';
import IssueRepository from 'src/repository/issue.repository';
import { StorageService } from './storage.service';

@Injectable()
export class IssueService {
  constructor(
    private issueRepository: IssueRepository,
    private storageService: StorageService,
  ) {}

  public async createIssue(userId: string, issue: any) {
    const upload = await this.storageService.upload('image');
    return await this.issueRepository.create(userId, issue, upload);
  }

  public async findRecentIssues(): Promise<IIssue[]> {
    return [];
  }

  public async findAllIssues(
    userId: string,
    lat: number = undefined,
    lng: number = undefined,
    categories: string[] = undefined,
    count: number = undefined,
  ) {
    const DISTANCE = 500; //임시: 조회 반경
    const rawIssues = await this.issueRepository.findManyInSquareByLatLng(
      lat,
      lng,
      DISTANCE,
      categories,
      count,
    );
    if (rawIssues.length == 0) return [];

    const iIssues = rawIssues.map((issue) =>
      this.formatRawIssue(issue, userId),
    );

    return { message: '사용자 주변 이슈 목록', data: { issues: iIssues } };
  }

  public async findIssueById(userId: string, issueId: number) {
    const rawIssue = await this.issueRepository.findOneById(issueId);

    if (!rawIssue) throw new NotFoundException('그런 이슈는 없어용');

    const issue = this.formatRawIssue(rawIssue, userId);

    return { message: '단일 이슈', data: { issue } };
  }

  public async findIssuesByUserId(userId: string): Promise<IIssue[]> {
    const rawIssues = await this.issueRepository.findManyByUserId(userId);
    const issues = rawIssues.map((issue) => this.formatRawIssue(issue, userId));
    return issues;
  }

  private formatRawIssue(
    rawIssue: RawIssue,
    userId: string,
  ): IIssue & { isMine: boolean } {
    try {
      const { issueCategoryId, category, image, ...rest } = rawIssue;
      const categoryName = category ? category.name : 'Any';
      const imageUrl = image ? image.location : '기본 이미지 Url';
      const isMine = userId == rawIssue.userId ? true : false;
      return { ...rest, category: categoryName, imageUrl, isMine };
    } catch (err) {
      throw new InternalServerErrorException("Can't format issue");
    }
  }
}
