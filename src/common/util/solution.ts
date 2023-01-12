import { IRawSolution, ISolution } from 'src/common/interface/dto/solution.dto';

export const rawSolutionToDto = (
  userId: string,
  solution: IRawSolution,
): ISolution => {
  try {
    const {
      image: { location },
      ...rest
    } = solution;

    const r: ISolution = {
      id: rest.id,
      userId: rest.userId,
      lat: rest.lat,
      lng: rest.lng,
      description: rest.description,
      createdAt: rest.createdAt,
      imageUrl: location || '',
      isMine: userId == solution.userId ? true : false,
    };

    return r;
  } catch (err) {
    return null;
  }
};
