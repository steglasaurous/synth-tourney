import { PartialType } from '@nestjs/mapped-types';
import { CreateScoreSubmissionDto } from './create-score-submission.dto';

export class UpdateScoreSubmissionDto extends PartialType(CreateScoreSubmissionDto) {}
