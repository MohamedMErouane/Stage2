// create-actualite.dto.ts

import { IsString } from 'class-validator';

export class CreateActualiteDto {
  @IsString()
  readonly title: string;
  
@IsString()
  fileUrl: string; 
}
