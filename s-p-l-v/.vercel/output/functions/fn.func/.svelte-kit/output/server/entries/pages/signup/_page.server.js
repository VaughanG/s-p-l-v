import { ZodString, ZodNumber, ZodBoolean, ZodArray, ZodObject, ZodRecord, ZodBigInt, ZodSymbol, ZodNullable, ZodDefault, ZodOptional, ZodEffects, ZodDate, ZodLiteral, ZodUnion, ZodEnum, ZodAny, ZodNativeEnum, z } from "zod";
import { r as redirect, f as fail } from "../../../chunks/index.js";
import { parse } from "devalue";
import { S as SuperFormError, m as mapErrors, c as clone } from "../../../chunks/utils.js";
import { a as auth, L as LuciaError } from "../../../chunks/lucia.js";
import { Prisma } from "@prisma/client";
function unwrapZodType(zodType) {
  let _wrapped = true;
  let isNullable = false;
  let isOptional = false;
  let hasDefault = false;
  let defaultValue = void 0;
  while (_wrapped) {
    if (zodType instanceof ZodNullable) {
      isNullable = true;
      zodType = zodType.unwrap();
    } else if (zodType instanceof ZodDefault) {
      hasDefault = true;
      defaultValue = zodType._def.defaultValue();
      zodType = zodType._def.innerType;
    } else if (zodType instanceof ZodOptional) {
      isOptional = true;
      zodType = zodType.unwrap();
    } else if (zodType instanceof ZodEffects) {
      zodType = zodType._def.schema;
    } else {
      _wrapped = false;
    }
  }
  return {
    zodType,
    isNullable,
    isOptional,
    hasDefault,
    defaultValue
  };
}
function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  if (hash < 0)
    hash = hash >>> 0;
  return hash.toString(36);
}
function entityHash(meta2) {
  return hashCode(JSON.stringify(meta2.types));
}
function entityData(schema2) {
  const cached = getCached(schema2);
  if (cached)
    return cached;
  const typeInfos = schemaInfo(schema2);
  const defaultEnt = defaultData(schema2);
  const metaData = meta(schema2);
  const entity = {
    typeInfo: typeInfos,
    defaultEntity: defaultEnt,
    constraints: constraints(schema2),
    meta: metaData,
    hash: entityHash(metaData),
    keys: Object.keys(schema2.keyof().Values)
  };
  setCached(schema2, entity);
  return entity;
}
function setCached(schema2, entity) {
  entityCache.set(schema2, entity);
}
function getCached(schema2) {
  return entityCache.get(schema2);
}
const entityCache = /* @__PURE__ */ new WeakMap();
function schemaInfo(schema2) {
  return _mapSchema(schema2, (obj) => unwrapZodType(obj));
}
function valueOrDefault(value, strict, implicitDefaults, schemaInfo2) {
  if (value)
    return value;
  const { zodType, isNullable, isOptional, hasDefault, defaultValue } = schemaInfo2;
  if (strict && value !== void 0)
    return value;
  if (hasDefault)
    return defaultValue;
  if (isNullable)
    return null;
  if (isOptional)
    return void 0;
  if (implicitDefaults) {
    if (zodType instanceof ZodString)
      return "";
    if (zodType instanceof ZodNumber)
      return 0;
    if (zodType instanceof ZodBoolean)
      return false;
    if (zodType instanceof ZodArray)
      return [];
    if (zodType instanceof ZodObject)
      return defaultData(zodType);
    if (zodType instanceof ZodRecord)
      return {};
    if (zodType instanceof ZodBigInt)
      return BigInt(0);
    if (zodType instanceof ZodSymbol)
      return Symbol();
  }
  return void 0;
}
function defaultData(schema2) {
  const fields = Object.keys(schema2.keyof().Values);
  let output = {};
  const schemaTypeInfo = schemaInfo(schema2);
  output = Object.fromEntries(fields.map((field) => {
    const typeInfo = schemaTypeInfo[field];
    const newValue = valueOrDefault(void 0, true, true, typeInfo);
    return [field, newValue];
  }));
  return output;
}
function constraints(schema2) {
  function constraint(key, zodType, info) {
    const output = {};
    if (zodType instanceof ZodString) {
      const patterns = zodType._def.checks.filter((f) => f.kind == "regex");
      if (patterns.length > 1) {
        throw new SuperFormError(`Invalid field "${key}": Only one regex is allowed per field.`);
      }
      const pattern = patterns.length == 1 && patterns[0].kind == "regex" ? patterns[0].regex.source : void 0;
      if (pattern)
        output.pattern = pattern;
      if (zodType.minLength !== null)
        output.minlength = zodType.minLength;
      if (zodType.maxLength !== null)
        output.maxlength = zodType.maxLength;
    } else if (zodType instanceof ZodNumber) {
      const steps = zodType._def.checks.filter((f) => f.kind == "multipleOf");
      if (steps.length > 1) {
        throw new SuperFormError(`Invalid field "${key}": Only one multipleOf is allowed per field.`);
      }
      const step = steps.length == 1 && steps[0].kind == "multipleOf" ? steps[0].value : null;
      if (zodType.minValue !== null)
        output.min = zodType.minValue;
      if (zodType.maxValue !== null)
        output.max = zodType.maxValue;
      if (step !== null)
        output.step = step;
    } else if (zodType instanceof ZodDate) {
      if (zodType.minDate)
        output.min = zodType.minDate.toISOString();
      if (zodType.maxDate)
        output.max = zodType.maxDate.toISOString();
    } else if (zodType instanceof ZodArray) {
      if (zodType._def.minLength)
        output.min = zodType._def.minLength.value;
      if (zodType._def.maxLength)
        output.max = zodType._def.maxLength.value;
      if (zodType._def.exactLength)
        output.min = output.max = zodType._def.exactLength.value;
    }
    if (!info.isNullable && !info.isOptional) {
      output.required = true;
    }
    return Object.keys(output).length > 0 ? output : void 0;
  }
  function mapField(key, value) {
    const info = unwrapZodType(value);
    value = info.zodType;
    if (value instanceof ZodArray) {
      return mapField(key, value._def.type);
    } else if (value instanceof ZodObject) {
      return constraints(value);
    } else {
      return constraint(key, value, info);
    }
  }
  return _mapSchema(schema2, (obj, key) => {
    return mapField(key, obj);
  }, (data) => !!data);
}
function meta(schema2) {
  return {
    types: _mapSchema(schema2, (obj) => {
      let type = unwrapZodType(obj).zodType;
      let name = "";
      let depth = 0;
      while (type instanceof ZodArray) {
        name += "ZodArray<";
        depth++;
        type = type._def.type;
      }
      return name + type.constructor.name + ">".repeat(depth);
    })
  };
}
function _mapSchema(schema2, factory, filter) {
  const keys = schema2.keyof().Values;
  return Object.fromEntries(Object.keys(keys).map((key) => [key, factory(schema2.shape[key], key)]).filter((entry) => filter ? filter(entry[1]) : true));
}
function formDataToValidation(schema2, fields, data) {
  const output = {};
  const entityInfo = entityData(schema2);
  function parseSingleEntry(key, entry, typeInfo) {
    if (entry && typeof entry !== "string") {
      return void 0;
    } else {
      return parseEntry(key, entry, typeInfo);
    }
  }
  for (const key of fields) {
    const typeInfo = entityInfo.typeInfo[key];
    const entries = data.getAll(key);
    if (!(typeInfo.zodType instanceof ZodArray)) {
      output[key] = parseSingleEntry(key, entries[0], typeInfo);
    } else {
      const arrayType = unwrapZodType(typeInfo.zodType._def.type);
      output[key] = entries.map((e) => parseSingleEntry(key, e, arrayType));
    }
  }
  function parseEntry(field, value, typeInfo) {
    const newValue = valueOrDefault(value, false, true, typeInfo);
    if (!value)
      return newValue;
    const zodType = typeInfo.zodType;
    if (zodType instanceof ZodString) {
      return value;
    } else if (zodType instanceof ZodNumber) {
      return zodType.isInt ? parseInt(value ?? "", 10) : parseFloat(value ?? "");
    } else if (zodType instanceof ZodBoolean) {
      return Boolean(value).valueOf();
    } else if (zodType instanceof ZodDate) {
      return new Date(value ?? "");
    } else if (zodType instanceof ZodArray) {
      const arrayType = unwrapZodType(zodType._def.type);
      return parseEntry(field, value, arrayType);
    } else if (zodType instanceof ZodBigInt) {
      try {
        return BigInt(value ?? ".");
      } catch {
        return NaN;
      }
    } else if (zodType instanceof ZodLiteral) {
      const literalType = typeof zodType.value;
      if (literalType === "string")
        return value;
      else if (literalType === "number")
        return parseFloat(value ?? "");
      else if (literalType === "boolean")
        return Boolean(value).valueOf();
      else {
        throw new SuperFormError("Unsupported ZodLiteral type: " + literalType);
      }
    } else if (zodType instanceof ZodUnion || zodType instanceof ZodEnum || zodType instanceof ZodAny) {
      return value;
    } else if (zodType instanceof ZodNativeEnum) {
      if (value in zodType.enum) {
        const enumValue = zodType.enum[value];
        if (typeof enumValue === "number")
          return enumValue;
        else if (enumValue in zodType.enum)
          return zodType.enum[enumValue];
      }
      return void 0;
    } else if (zodType instanceof ZodSymbol) {
      return Symbol(value);
    }
    throw new SuperFormError("Unsupported Zod default type: " + zodType.constructor.name);
  }
  return output;
}
async function superValidate(data, schema2, options) {
  if (data && typeof data === "object" && "safeParseAsync" in data) {
    options = schema2;
    schema2 = data;
    data = null;
  }
  options = {
    noErrors: false,
    errors: void 0,
    includeMeta: false,
    ...options
  };
  const originalSchema = schema2;
  let wrappedSchema = schema2;
  let hasEffects = false;
  while (wrappedSchema instanceof ZodEffects) {
    hasEffects = true;
    wrappedSchema = wrappedSchema._def.schema;
  }
  if (!(wrappedSchema instanceof ZodObject)) {
    throw new SuperFormError("Only Zod schema objects can be used with superValidate. Define the schema with z.object({ ... }) and optionally refine/superRefine/transform at the end.");
  }
  const realSchema = wrappedSchema;
  const entityInfo = entityData(realSchema);
  const schemaKeys = entityInfo.keys;
  function parseFormData(data2) {
    function tryParseSuperJson(data3) {
      if (data3.has("__superform_json")) {
        try {
          const output2 = parse(data3.getAll("__superform_json").join() ?? "");
          if (typeof output2 === "object") {
            return output2;
          }
        } catch {
        }
      }
      return null;
    }
    const superJson = tryParseSuperJson(data2);
    return superJson ? superJson : formDataToValidation(realSchema, schemaKeys, data2);
  }
  async function tryParseFormData(request) {
    let formData = void 0;
    try {
      formData = await request.formData();
    } catch (e) {
      if (e instanceof TypeError && e.message.includes("already been consumed")) {
        throw e;
      }
      return null;
    }
    return parseFormData(formData);
  }
  function parseSearchParams(data2) {
    if (data2 instanceof URL)
      data2 = data2.searchParams;
    const convert = new FormData();
    for (const [key, value] of data2.entries()) {
      convert.append(key, value);
    }
    return parseFormData(convert);
  }
  if (data instanceof FormData) {
    data = parseFormData(data);
  } else if (data instanceof Request) {
    data = await tryParseFormData(data);
  } else if (data instanceof URL || data instanceof URLSearchParams) {
    data = parseSearchParams(data);
  } else if (data && typeof data === "object" && "request" in data && data.request instanceof Request) {
    data = await tryParseFormData(data.request);
  }
  let output;
  if (!data) {
    const addErrors = options.errors === true;
    let valid = false;
    let errors = {};
    if (hasEffects || addErrors) {
      const result = await originalSchema.spa(entityInfo.defaultEntity);
      valid = result.success;
      if (result.success) {
        data = result.data;
      } else if (addErrors) {
        errors = mapErrors(result.error.format());
      }
    }
    output = {
      valid,
      errors,
      // Copy the default entity so it's not modified
      data: data ?? clone(entityInfo.defaultEntity),
      empty: true,
      constraints: entityInfo.constraints
    };
  } else {
    const addErrors = options.errors !== false && options.noErrors !== true;
    const partialData = data;
    const result = await originalSchema.spa(partialData);
    if (!result.success) {
      const errors = addErrors ? mapErrors(result.error.format()) : {};
      output = {
        valid: false,
        errors,
        data: Object.fromEntries(schemaKeys.map((key) => [
          key,
          key in partialData ? partialData[key] : clone(entityInfo.defaultEntity[key])
        ])),
        empty: false,
        constraints: entityInfo.constraints
      };
    } else {
      output = {
        valid: true,
        errors: {},
        data: result.data,
        empty: false,
        constraints: entityInfo.constraints
      };
    }
  }
  if (options.includeMeta) {
    output.meta = entityInfo.meta;
  }
  if (options.id !== void 0) {
    output.id = options.id === true ? entityInfo.hash : options.id;
  }
  return output;
}
const schema = z.object({
  name: z.string().min(3).max(32),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(20)
});
const load = async (event) => {
  const form = await superValidate(event, schema);
  const session = await event.locals.auth.validate();
  if (session)
    throw redirect(302, "/");
  return { form };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event, schema);
    console.log("POST", form);
    if (!form.valid) {
      return fail(400, { form });
    }
    const { name, username, email, password } = form.data;
    try {
      const user = await auth.createUser({
        primaryKey: {
          providerId: "username",
          providerUserId: username,
          password
        },
        attributes: {
          name,
          username,
          email
        }
      });
      const session = await auth.createSession(user.userId);
      event.locals.auth.setSession(session);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && error.message?.includes("username")) {
        return fail(400, {
          message: "Username already in use"
        });
      }
      if (error instanceof LuciaError && error.message === "AUTH_DUPLICATE_KEY_ID") {
        return fail(400, {
          message: "Username already in use"
        });
      }
      console.error(error);
      return fail(500, {
        message: "Unknown error occurred"
      });
    }
    return { form };
  }
};
export {
  actions,
  load
};
