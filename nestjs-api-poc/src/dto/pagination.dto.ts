import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
 @ApiPropertyOptional({
   description: 'Page number',
   default: 1,
   minimum: 1
 })
 @Type(() => Number)
 @IsInt()
 @Min(1)
 @IsOptional()  
 pageNumber?: number = 1;

 @ApiPropertyOptional({
   description: 'Number of items per page',
   default: 10,
   minimum: 1
 })
 @Type(() => Number)
 @IsInt()
 @Min(1)
 @IsOptional()
 pageSize?: number = 10;
}
