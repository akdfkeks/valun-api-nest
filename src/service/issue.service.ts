import { Injectable } from '@nestjs/common';
import {
  CategoriesOnIssue,
  Issue as PIssue,
  IssueStatus,
} from '@prisma/client';
import IssueRepository from 'src/repository/issue.repository';

@Injectable()
export class IssueService {
  constructor(private issueRepository: IssueRepository) {}

  public async findRecentIssues(): Promise<IIssue[] | any[]> {
    return [];
  }

  public async findIssueById(issueId: number): Promise<IIssue | any> {
    const rawIssue = await this.issueRepository.findOneById(issueId);
    const issue = this.flattenIssueCategory(rawIssue);

    return issue;
  }

  public async findIssuesByUserId(userId: string): Promise<IIssue[] | any[]> {
    const rawIssues = await this.issueRepository.findManyByUserId(userId);

    return [];
  }

  private flattenIssueCategory(rawIssue: TRawIssue): IIssue | any {
    const { categories, ...rest } = rawIssue;
    let r: IIssue = {
      ...rest,
      categories: [],
    };

    return r;
  }
}

type TRawIssue = PIssue & {
  categories: (CategoriesOnIssue & { category: { name: string } })[];
};

interface IIssue {
  id: number;
  userId: string;
  categories: string[];
  status: string;
  createdAt: Date;
}
