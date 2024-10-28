type envTypes = string | boolean | number;

function envOrDefault(key: string, defaultValue?: envTypes): envTypes {
  const retVal = process.env[key] || defaultValue;
  if (retVal == undefined) {
    throw new Error(`Environmental value ${key} is undefined!`);
  }
  return retVal;
}

export { envOrDefault };
