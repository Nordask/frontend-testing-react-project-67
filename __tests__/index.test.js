import os from 'os';
import fs, { readFileSync } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fsp from 'fs/promises';
import nock from 'nock';
import pageLoader from '../src/index.js';

const filename = fileURLToPath(import.meta.url);
const directoryName = dirname(filename);
const getFixturePath = (...value) => path.join(directoryName, '..', '__fixtures__', ...value);
const readFixture = (...value) => readFileSync(getFixturePath(...value), 'utf-8');
const fixDirname = '__fixtures__';

const BASE_URL = 'https://ru.hexlet.io';
const PAGE = '/courses';
const PAGE_URL = `${BASE_URL}${PAGE}`;
const ADDITIONAL_FILES_FOLDER = 'ru-hexlet-io-courses_files';
const MAIN_FILE_NAME = 'ru-hexlet-io-courses.html';
const IMAGE_FILE_NAME = 'ru-hexlet-io-assets-professions-nodejs.png';
const IMAGE_URL = '/assets/professions/nodejs.png';
const CANONICAL_FILE_NAME = 'ru-hexlet-io-courses.html';

let tmpDirPath = '';

describe('pageLoading', () => {
  beforeEach(async () => {
    tmpDirPath = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });
  it('should loading file to output', async () => {
    const MAIN_FILE = readFixture(MAIN_FILE_NAME);
    const IMAGE_FILE = readFixture(ADDITIONAL_FILES_FOLDER, IMAGE_FILE_NAME);
    const ADDITIONAL_FILE = readFixture(ADDITIONAL_FILES_FOLDER, CANONICAL_FILE_NAME);

    nock(BASE_URL)
      .get(PAGE)
      .reply(200, MAIN_FILE)
      .get(IMAGE_URL)
      .reply(200, IMAGE_FILE);
      // .get(`/${ADDITIONAL_FILES_FOLDER}/${CANONICAL_FILE_NAME}`)
      // .reply(200, ADDITIONAL_FILE);

    await pageLoader(PAGE_URL, tmpDirPath);

    const expectedPage = await readFixture('expected.html');
    const actualPage = await fsp.readFile(path.resolve(tmpDirPath, MAIN_FILE_NAME), 'utf8');
    console.log('qq1', await fsp.readdir(`${tmpDirPath}/${ADDITIONAL_FILES_FOLDER}`));
    const actualImagePage = await fsp.readFile(path.resolve(tmpDirPath, ADDITIONAL_FILES_FOLDER, 'ru-hexlet-io-assets-professions-nodejs.png'), 'utf8');
    // const actualAdditionalPage = await fsp.readFile(path.resolve(tmpDirPath, ADDITIONAL_FILES_FOLDER, 'ru-hexlet-io-ru-hexlet-io-courses-files-ru-hexlet-io-courses.html'), 'utf8');

    expect(actualPage).toEqual(expectedPage);
    expect(actualImagePage).toEqual(IMAGE_FILE);
    // expect(actualAdditionalPage).toEqual(ADDITIONAL_FILE);
  });
  it('should reject with error. Wrong url', async () => {
    nock('http://wrong')
      .get('/page')
      .reply(404, '');
    await expect(pageLoader('http://wrong/page', tmpDirPath)).rejects.toThrow('Request failed with status code 404');
  });
  it('should reject with error. Wrong path', async () => {
    nock(BASE_URL)
      .get(PAGE)
      .reply(200, 'data');

    await expect(pageLoader(PAGE_URL, 'notExixstPath')).rejects.toThrow('no such file or directory');
  });
});