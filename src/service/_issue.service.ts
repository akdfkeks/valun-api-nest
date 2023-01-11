import { Injectable, NotFoundException } from '@nestjs/common';
import { IssueRepository } from 'src/repository/_issue.repository';
import { StorageService } from './storage.service';

@Injectable()
export class IssueService {
  constructor(
    private issueRepository: IssueRepository,
    private storageService: StorageService,
  ) {}

  public async createIssue(userId: string) {}

  public async findRecentIssues() {
    const recents = await this.issueRepository.findManyUnsolvedByLocation({
      take: 5,
    });
  }
  public async findAroundIssues(userId: string) {}

  public async findMyUnsolvedIssues(userId: string) {}
  public async findMyPendingIssues(userId: string) {}
  public async findMySolvedIssues(userId: string) {}
  public async findMyAllIssues(userId: string) {}

  public async updateIssue(userId: string) {}
  public async deleteIssue(userId: string) {}
}
