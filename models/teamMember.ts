import {
  jsonSchemaDecoratorFactoryOfFile,
  jsonSchemaOf,
} from "@fartlabs/declarative/common/json-schema";
import { Ajv } from "ajv";

const jsonSchema = await jsonSchemaDecoratorFactoryOfFile(import.meta.url);

@jsonSchema()
export class TeamMember {
  public constructor(
    // public id: string,
    public name: string,
    public role: string,
    public email: string,
  ) {}

  public validate() {
    const validator = ajv.compile(jsonSchemaOf(TeamMember));
    return validator(this);
  }
}

const ajv = new Ajv();
