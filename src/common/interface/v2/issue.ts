import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { categories } from 'src/common/config/category';
import { includes } from 'src/common/util/v2/common';

export class GetIssuesQuery {
  @Transform(({ value }: { value: string }) => {
    const r = value.split(',').filter((key) => includes(categories, key));
    console.log(r);
    console.log(`return : ${r.length !== 0 ? r : undefined}`);
    return r.length !== 0 ? r : undefined;
  })
  @IsOptional()
  categories: string[] = undefined;
}
