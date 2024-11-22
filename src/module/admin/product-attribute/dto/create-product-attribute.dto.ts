import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ArrayUnique, IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateProductAttributeDto {
  @ApiProperty({
    example: "color",
    description: "The title of the attribute",
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => value.toLowerCase())
  title: string;

  @ApiProperty({
    example: ["red", "blue", "green"],
    description: "The values of the attribute",
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  @Transform(({ value }) => value.map((e: string) => e.trim()))
  @Transform(({ value }) => value.map((e: string) => e.toLowerCase()))
  @ArrayUnique({ message: "All attribute values must be unique" }) // Validate uniqueness
  values: string[];
}

export class CreateProductAttributeValueDto {
  @ApiProperty({
    example: "color",
    description: "The title of the attribute",
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => value.toLowerCase())
  title: string;

  @ApiProperty({
    example: "red",
    description: "The value of the attribute",
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @Transform(({ value }) => value.toLowerCase())
  value: string;
}
