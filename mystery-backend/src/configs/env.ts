type envTypes = string | boolean | number;

function envOrDefault<T extends envTypes>(key: string, defaultValue?: T): T {
  const retVal = (process.env[key] as T) ?? defaultValue;
  if (retVal === undefined) {
    throw new Error(`Environmental value ${key} is undefined!`);
  }
  return retVal;
}

export { envOrDefault };
