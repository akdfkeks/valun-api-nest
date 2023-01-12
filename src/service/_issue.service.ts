import { Injectable, NotFoundException } from '@nestjs/common';
import { Multer } from 'multer';
import { CreateIssueBody } from 'src/interface/dto/issue.dto';
import { IssueRepository } from 'src/repository/_issue.repository';
import { exclude } from 'src/util/function';
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
    const uploadedImage = await this.storageService.upload(image);
    const createdIssue = await this.issueRepository.create(
      userId,
      issue,
      uploadedImage,
    );

    return {
      message: 'Issue 제보 성공',
      data: {
        id: createdIssue.id,
        createdAt: new Date().toUTCString(),
      },
    };
  }

  public async findSampleIssues(categories: string[]) {
    const samples = await this.issueRepository.findManyUnsolvedByLocation({
      categories,
      take: 5,
    });

    const flatIssues = samples.map((s) =>
      exclude(s, ['user', 'issueCategoryId']),
    );

    return {
      message: '5 issue samples',
      data: {
        issues: flatIssues,
      },
    };
  }

  public async findRecentIssues() {
    const recents = await this.issueRepository.findManyUnsolvedByLocation({
      lat: 37.12345,
      lng: 127.12345,
      take: 5,
    });

    return {
      message: '최근 제보된 5건의 Issue',
      data: {
        issues: ['1', '2', '3', '4', '5'],
      },
    };
  }

  public async findAroundIssues(userId: string) {
    const arounds = await this.issueRepository.findManyUnsolvedByLocation({
      lat: 37.12345,
      lng: 37.12345,
      categories: ['pet', 'etc'],
    });
  }

  public async findMyUnsolvedIssues(userId: string) {}
  public async findMyPendingIssues(userId: string) {}
  public async findMySolvedIssues(userId: string) {}
  public async findMyAllIssues(userId: string) {}

  public async updateIssue(userId: string) {}
  public async deleteIssue(userId: string) {}
}
