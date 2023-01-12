import { Prisma } from '@prisma/client';
import { CreateImageDto } from 'src/common/interface/dto/image.dto';
import { CreateIssueBody } from 'src/common/interface/dto/issue.dto';

// Create
export const createIssueWithImageValidator = (
  userId: string,
  issueDto: CreateIssueBody,
  imageDto: CreateImageDto,
) => {
  return Prisma.validator<Prisma.IssueCreateInput>()({
    user: { connect: { id: userId } },
    category: {
      connectOrCreate: {
        where: { name: issueDto.category },
        create: { name: issueDto.category },
      },
    },
    description: issueDto.description,
    lat: issueDto.lat,
    lng: issueDto.lng,
    image: { create: createImageValidator(imageDto) },
  });
};

const createImageValidator = (imageDto: CreateImageDto) => {
  return Prisma.validator<Prisma.IssueImageCreateInput>()({
    ...imageDto,
    // format: imageDto.format,
    // sourceName: imageDto.sourceName,
    // regularName: imageDto.regularName,
    // sourceSize: imageDto.sourceSize,
    // compdSize: imageDto.compdSize,
    // location: imageDto.location,
  });
};

// Read

export const categoryAndImage = Prisma.validator<Prisma.IssueInclude>()({
  category: {
    select: { name: true },
  },
  image: {
    select: { location: true },
  },
});

export const findOneByIdValidator = (id: number) => {};
export const findManyByIdValidator = () => {};
export const findManyByUserIdValidator = () => {};

// Update
// Delete

export interface ISearchByLocal {
  lat?: number;
  lng?: number;
  categories?: string[];
  take?: number;
}
