import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateChatDto {
  @ValidateIf((dto: CreateChatDto) => dto.participantIds.length > 1)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ValidateIf((dto: CreateChatDto) => dto.participantIds.length > 1)
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  participantIds: number[] = [];
}
