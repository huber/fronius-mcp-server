import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PackageJson {
  name: string;
  version: string;
}

let cachedPackageJson: PackageJson | null = null;

function getPackageJson(): PackageJson {
  if (cachedPackageJson) {
    return cachedPackageJson;
  }

  try {
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    cachedPackageJson = JSON.parse(packageJsonContent);
    return cachedPackageJson!;
  } catch (error) {
    console.warn('Could not read package.json, using fallback version');
    return { name: 'fronius-mcp-server', version: '1.0.0' };
  }
}

export function getVersion(): string {
  return getPackageJson().version;
}

export function getName(): string {
  return getPackageJson().name;
}

export function getUserAgent(): string {
  const pkg = getPackageJson();
  return `${pkg.name}/${pkg.version}`;
}