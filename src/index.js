import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { addLinks, getFileName, loadAdditionalFiles } from './utils/index.js';


const pageLoader = (url, outputPath = process.cwd()) => {
  const mainFileName = getFileName(url);
  const mainFilePath = path.resolve(outputPath, `${mainFileName}.html`);
  const additionalFilesDirectoryName = `${mainFileName}_files`;;
  const additionalFilesDirectoryPath = path.resolve(outputPath, additionalFilesDirectoryName);;

  return axios.get(url)
    .then(async (response) => {
      const { data } = response;
      const page = addLinks({ page: data, directory: additionalFilesDirectoryName, url });

      await fsp.writeFile(mainFilePath, page); 
      await fsp.mkdir(additionalFilesDirectoryPath)

      return data;
    })
    .then((data) => loadAdditionalFiles({ page: data, url }))
    .then((files) => {
      const promises = files.map((file) => {
        const pathToFile = path.resolve(additionalFilesDirectoryPath, file.path);
        return fsp.writeFile(pathToFile, file.data)
          .then(() => {
            return file.url;
          });
      });
      return Promise.all(promises);
    });
};

export default pageLoader;