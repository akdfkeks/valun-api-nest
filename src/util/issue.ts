import {
  IExtendedRawIssue as IRawIssue,
  IIssue,
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
