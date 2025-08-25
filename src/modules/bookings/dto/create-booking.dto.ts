import {
  IsString,
  Length,
  Matches,
  IsIn,
  IsOptional,
  MaxLength,
  Validate,
} from "class-validator";
import { Type } from "class-transformer";
import { IsFutureWithLeadTime } from "../validators/is-future-with-leadtime.validator";

export class CreateBookingDto {
  @IsString()
  @Length(2, 80)
  clientName!: string;

  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: "clientPhone must be E.164" })
  clientPhone!: string;

  @IsIn(["MANICURE", "PEDICURE", "HAIRCUT"])
  service!: "MANICURE" | "PEDICURE" | "HAIRCUT";

  @Type(() => Date)
  @Validate(IsFutureWithLeadTime, [15])
  startsAt!: Date;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  notes?: string;
}
