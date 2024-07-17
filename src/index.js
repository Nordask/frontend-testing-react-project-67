import fsp from 'fs/promises';
import debug from 'debug';
import axios from 'axios';
import path from 'path';
import { addLinks, getFileName, loadAdditionalFiles } from './utils/index.js';
import { DEBUGGER_BREAK_ROW } from './utils/constants.js';

const log = debug('page-loader');

const pageLoader = (url, outputPath = process.cwd()) => {
  const mainFileName = getFileName(url);
  const mainFilePath = path.resolve(outputPath, `${mainFileName}.html`);
  const additionalFilesDirectoryName = `${mainFileName}_files`;;
  const additionalFilesDirectoryPath = path.resolve(outputPath, additionalFilesDirectoryName);;

  return axios.get(url)
    .then(async (response) => {
      const { data } = response;
      log('raw html file', data, DEBUGGER_BREAK_ROW);
      const page = addLinks({ page: data, directory: additionalFilesDirectoryName, url });
      log('html file with links', page, DEBUGGER_BREAK_ROW);

      await fsp.writeFile(mainFilePath, page); 
      await fsp.mkdir(additionalFilesDirectoryPath)

      return data;
    })
    .then((data) => loadAdditionalFiles({ page: data, url }))
    .then((files) => {
      const promises = files.map((file) => {
        const pathToFile = path.resolve(additionalFilesDirectoryPath, file.path);
        log('path to file', pathToFile);
        return fsp.writeFile(pathToFile, file.data)
          .then(() => {
            return file.url;
          });
      });

      return Promise.all(promises);
    })
    .then(() => {
      const mainFileName = getFileName(url);
      return { filepath: `${outputPath}/${mainFileName}.html` };
    });
};

export default pageLoader;