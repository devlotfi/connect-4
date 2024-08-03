import { IsJWT, Max, Min } from 'class-validator';

export class MakeMoveMessage {
  @IsJWT()
  gameToken: string;

  @Min(0)
  @Max(6)
  column: number;
}
