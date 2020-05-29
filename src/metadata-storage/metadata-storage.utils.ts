import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { MetadataArgsStorage } from './metadata-args';

export function getMetadataArgsStorage(): MetadataArgsStorage {
  const globalScope = PlatformTools.getGlobalVariable();
  if (!globalScope.bravoMetadataArgsStorage) {
    globalScope.bravoMetadataArgsStorage = new MetadataArgsStorage();
  }
  return globalScope.bravoMetadataArgsStorage;
}
