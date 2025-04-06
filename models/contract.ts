import { getPrototypeValue } from "@fartlabs/declarative";
import { docOf } from "@fartlabs/declarative/common/jsonld";
import {
  jsonSchemaDecoratorFactoryOfFile,
  type ValueJSONSchema,
} from "@fartlabs/declarative/common/json-schema";
import jsonld from "jsonld";
import { Ajv } from "ajv";

const jsonSchema = await jsonSchemaDecoratorFactoryOfFile(import.meta.url);

@jsonSchema()
export class Contract {
  public constructor(
    public id: number,
    public teamName: string,
    public projectIdea: string,
    public members: number[],
    public firstPrototypeDate: string,
    public finalProductDate: string,
    public decisionMethod: "Majority Vote" | "Representative Decision",
    public customRules: string,
    public signedAgreement: boolean,
  ) {}
}

if (import.meta.main) {
  const contract = new Contract(
    423232113,
    "Ash Ketchum",
    "Pokemon fetch project",
    [776735858],
    new Date().toISOString(),
    new Date().toISOString(),
    "Majority Vote",
    "Anybody not agreeing to the decision method will not be thrown out of the team.",
    true,
  );
  const expandedContract = await jsonld.expand(docOf(contract));
  console.log(expandedContract);

  const ajv = new Ajv();
  const validate = ajv.compile(
    getPrototypeValue<ValueJSONSchema>(Contract)?.jsonSchema,
  );
  const isValid = validate(contract);
  console.log(isValid);
}
