import * as cheerio from 'cheerio';
import axios from 'axios';
import Listr from 'listr';
import path from 'path';
import { getFileName } from './getFileName.js';
import { getLink } from './getLink.js';
import { TAGS } from './constants.js';

const getLinks = (html, hostname) => {
  const result = cheerio.load(html);

  return TAGS.reduce((acc, src) => {
    result('html')
      .find(src.name)
      .toArray()
      .filter((link) => result(link).attr(src.src))
      .forEach((link) => {
        const currentLink = getLink(hostname, result(link).attr(src.src));
        if (currentLink && acc.indexOf(currentLink) === -1) {
          acc.push(currentLink);
        }
      });
    return acc;
  }, []);
};

export const handleLinks = (url) => {
  let taskData;
  const tasks = new Listr([
    {
      title: `Downloading file '${url}'`,
      task: (_, task) => axios.get(url, { responseType: 'arraybuffer' })
      .then((response) => { taskData = response; }).catch((e) => task.skip(`Fail load '${url}'. ${e.message}`)),
    },
  ]);
  return tasks.run()
    .then(() => taskData);
};

export const loadAdditionalFiles = ({ page, url }) => {
  const links = getLinks(page, url);
  const promises = links.map((link) => Promise.resolve(handleLinks(link, axios.get, { responseType: 'arraybuffer' })));
  return Promise.all(promises)
    .then((data) => data.filter((file) => file))
    .then((filteredData) => filteredData.map((file) => {
      const ext = path.extname(file.config.url);
      const resultPath = `${getFileName(file.config.url)}${ext ?? '.html'}`;
      return { url: file.config.url, path: resultPath, data: file.data };
    }));
};

export default loadAdditionalFiles;