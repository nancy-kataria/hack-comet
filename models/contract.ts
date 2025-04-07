import {
  jsonSchemaDecoratorFactoryOfFile,
  jsonSchemaOf,
} from "@fartlabs/declarative/common/json-schema";
import { Ajv } from "ajv";

const jsonSchema = await jsonSchemaDecoratorFactoryOfFile(import.meta.url);

@jsonSchema()
export class Contract {
  public constructor(
    public id: string,
    public teamName: string,
    public teamLead: string,
    public projectIdea: string,
    public members: { name: string; role: string; email: string }[],
    public firstPrototypeDate: string,
    public finalProductDate: string,
    public decisionMethod: "Majority Vote" | "Representative Decision",
    public customRules: string,
    public signedAgreement: boolean,
  ) {}

  public validate() {
    const validator = ajv.compile(jsonSchemaOf(Contract));
    return validator(this);
  }
}

const ajv = new Ajv();
