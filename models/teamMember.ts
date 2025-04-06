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
export class TeamMember {
  public constructor(
    public id: number,
    public name: string,
    public role: string,
  ) {}
}

if (import.meta.main) {
  const member = new TeamMember(776735858, "Ash Ketchum", "pokemon trainer`");
  const expandedMember = await jsonld.expand(docOf(member));
  console.log(expandedMember);

  const ajv = new Ajv();
  const validate = ajv.compile(
    getPrototypeValue<ValueJSONSchema>(TeamMember)?.jsonSchema,
  );
  const isValid = validate(member);
  console.log(isValid);
}
