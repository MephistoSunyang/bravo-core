import fs from 'fs';
import log4js from 'log4js';
import path from 'path';

export const getLogFolder = () => {
  const folder = process.env.DEBUG_FOLDER || 'logs/';
  return path.join(process.cwd(), folder);
};

export const logger = (category: string): log4js.Logger => {
  const folder = getLogFolder();
  const pattern = process.env.DEBUG_PATTERN || 'yyyy-MM-dd.log';
  const level = process.env.DEBUG_LEVEL || 'all';
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  log4js.configure({
    appenders: {
      app: {
        type: 'dateFile',
        filename: folder,
        pattern,
        alwaysIncludePattern: true,
      },
    },
    categories: {
      default: {
        appenders: ['app'],
        level,
      },
    },
  });
  return log4js.getLogger(category);
};
