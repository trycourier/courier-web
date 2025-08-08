export const getDependencyVersion = (packageJson: PackageJson, dependency: string) => {
  const version = packageJson.dependencies[dependency];
  if (!version) {
    throw new Error(`Dependency ${dependency} not found in package.json`);
  }
  return version;
};

export interface PackageJson {
  dependencies: Record<string, string>;
}
