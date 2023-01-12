import { Issue, Solution, SolutionImage } from '@prisma/client';
import {
  IExtendedRawIssue as IRawIssue,
  IIssue,
  IIssueIncludable,
  IssueIncludable,
} from 'src/interface/dto/issue.dto';

export const rawIssueToDto = (userId: string, issue: IRawIssue): IIssue => {
  try {
    const { issueCategoryId, category, image, ...rest } = issue;

    const r: IIssue = {
      ...rest,
      category: category ? category.name : 'any',
      imageUrl: image ? image.location : '기본 이미지 Url',
      isMine: userId == issue.userId ? true : false,
    };

    return r;
  } catch (err) {
    return null;
  }
};

export const categoryParser = (keys: string, obj: Record<string, string>) => {
  const categoryList = Object.values(obj);
  const refined = keys.split(',').filter((element) => {
    return categoryList.includes(element);
  });
  return refined.length == 0 ? undefined : refined;
};

export const transformIssue = (
  userId: string,
  input: Issue & Omit<IssueIncludable, 'user' | 'issueComments'>,
): IIssue => {
  // 오류가 발생하면 반환하지 않도록 할 수 있을까?
  return {
    id: input.id,
    userId: input.userId || 'unknown',
    status: input.status,
    category: input.category.name,
    description: input.description || '',
    lat: input.lat,
    lng: input.lng,
    imageUrl: input.image.location,
    createdAt: input.createdAt,
    isMine: userId == input.userId ? true : false,
  };
};

export const transformSolution = (
  input: Solution & { image: SolutionImage },
) => {};

const flatIssue = (
  issue: Omit<Issue & IIssueIncludable, 'user' | 'issueCategoryId'>,
) => {
  return {};
};
