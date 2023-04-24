import { parse, stringify } from "devalue";
class SuperFormError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, SuperFormError.prototype);
  }
}
function mapErrors(obj, top = true) {
  const output = {};
  const entries = Object.entries(obj);
  if (entries.length === 1 && entries[0][0] === "_errors" && obj._errors.length) {
    return top ? obj : obj._errors;
  } else if (obj._errors.length) {
    output._errors = obj._errors;
  }
  for (const [key, value] of entries.filter(([key2]) => key2 !== "_errors")) {
    output[key] = mapErrors(value, false);
  }
  return output;
}
function findErrors(errors, path = []) {
  const entries = Object.entries(errors);
  return entries.flatMap(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      const currPath = path.concat([key]);
      return value.map((message) => ({ path: currPath, message }));
    } else {
      return findErrors(errors[key], path.concat([key]));
    }
  });
}
function pathExists(obj, path, value) {
  const exists = traversePath(obj, path);
  if (!exists)
    return void 0;
  if (value === void 0)
    return exists;
  return value(exists.value) ? exists : void 0;
}
function traversePath(obj, path, modifier) {
  if (!path.length)
    return void 0;
  path = [...path];
  let parent = obj;
  while (path.length > 1) {
    const key2 = path[0];
    const value = modifier ? modifier({
      parent,
      key: String(key2),
      value: parent[key2]
    }) : parent[key2];
    if (value === void 0)
      return void 0;
    else
      parent = value;
    path.shift();
  }
  const key = path[0];
  return {
    parent,
    key: String(key),
    value: parent[key]
  };
}
function traversePaths(parent, modifier, path = []) {
  for (const key in parent) {
    const value = parent[key];
    const isLeaf = value === null || typeof value !== "object";
    const pathData = {
      parent,
      key,
      value,
      path: path.map(String).concat([key]),
      isLeaf
    };
    const status = modifier(pathData);
    if (status === "abort")
      return status;
    else if (status === "skip")
      break;
    else if (!isLeaf) {
      const status2 = traversePaths(value, modifier, pathData.path);
      if (status2 === "abort")
        return status2;
    }
  }
}
async function traversePathsAsync(parent, modifier, path = []) {
  for (const key in parent) {
    const value = parent[key];
    const isLeaf = value === null || typeof value !== "object";
    const pathData = {
      parent,
      key,
      value,
      path: path.map(String).concat([key]),
      isLeaf
    };
    const status = await modifier(pathData);
    if (status === "abort")
      return status;
    else if (status === "skip")
      break;
    else if (!isLeaf) {
      const status2 = traversePaths(value, modifier, pathData.path);
      if (status2 === "abort")
        return status2;
    }
  }
}
function comparePaths(newObj, oldObj) {
  const diffPaths = /* @__PURE__ */ new Map();
  function checkPath(data, compareTo) {
    if (data.isLeaf) {
      const exists = traversePath(compareTo, data.path);
      if (!exists) {
        diffPaths.set(data.path.join(" "), data.path);
      } else if (data.value instanceof Date && exists.value instanceof Date && data.value.getTime() != exists.value.getTime()) {
        diffPaths.set(data.path.join(" "), data.path);
      } else if (data.value !== exists.value) {
        diffPaths.set(data.path.join(" "), data.path);
      }
    }
  }
  traversePaths(newObj, (data) => checkPath(data, oldObj));
  traversePaths(oldObj, (data) => checkPath(data, newObj));
  return Array.from(diffPaths.values());
}
function setPaths(obj, paths, value) {
  for (const path of paths) {
    const leaf = traversePath(obj, path, ({ parent, key, value: value2 }) => {
      if (value2 === void 0 || typeof value2 !== "object") {
        parent[key] = {};
      }
      return parent[key];
    });
    if (leaf)
      leaf.parent[leaf.key] = value;
  }
}
function clone(data) {
  if ("structuredClone" in globalThis) {
    return structuredClone(data);
  }
  return parse(stringify(data));
}
export {
  SuperFormError as S,
  comparePaths as a,
  traversePathsAsync as b,
  clone as c,
  findErrors as f,
  mapErrors as m,
  pathExists as p,
  setPaths as s,
  traversePath as t
};
