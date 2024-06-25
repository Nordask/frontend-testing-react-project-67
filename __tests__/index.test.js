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

const JSON_FILE_NAME = 'ru-hexlet-io-manifest.json';
const SCRIPT_FILE_NAME = 'ru-hexlet-io-courses';
const pageName = 'ru-hexlet-io-courses';
const ext = '.html';

let tmpDirPath = '';

describe('pageLoading', () => {
  beforeEach(async () => {
    tmpDirPath = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });
  it('should loading file to output', async () => {
    // console.log('qq111111111111', getFixturePath('test_page.html'), directoryName);
    const MAIN_FILE = readFixture('ru-hexlet-io-courses.html');
    nock(BASE_URL)
      .get(PAGE)
      .reply(200, MAIN_FILE);
    await pageLoader(PAGE_URL, tmpDirPath);

    const expectedPage = await readFixture('expected.html');
    const actualPage = await fsp.readFile(path.resolve(tmpDirPath, 'ru-hexlet-io-courses.html'), 'utf8');

    expect(actualPage).toEqual(expectedPage);
  });
});