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

const BASE_URL = 'https://ru.hexlet.io';
const PAGE = '/courses';
const PAGE_URL = `${BASE_URL}${PAGE}`;
const ADDITIONAL_FILES_FOLDER = 'ru-hexlet-io-courses_files';
const MAIN_FILE_NAME = 'ru-hexlet-io-courses.html';
const IMAGE_FILE_NAME = 'nodejs.png';
const IMAGE_URL = '/assets/professions/nodejs.png';
const IMAGE_FILE_NAME_TMP = 'ru-hexlet-io-assets-professions-nodejs.png';
const SCRIPT_FILE_NAME = 'runtime.js';
const SCRIPT_URL = '/packs/js/runtime.js';
const SCRIPT_FILE_NAME_TMP = 'ru-hexlet-io-packs-js-runtime.js';
const STYLES_FILE_NAME = 'application.css';
const STYLES_URL = '/assets/application.css';
const STYLES_FILE_NAME_TMP = 'ru-hexlet-io-assets-application.css';
const CANONICAL_FILE_NAME = 'canonical.html';
const CANONICAL_URL = '/courses';
const CANONICAL_FILE_NAME_TMP = 'ru-hexlet-io-courses.html';


let tmpDirPath = '';

describe('pageLoading', () => {
  beforeEach(async () => {
    tmpDirPath = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });
  it('should loading file to output', async () => {
    const MAIN_FILE = readFixture(MAIN_FILE_NAME);
    const IMAGE_FILE = readFixture(ADDITIONAL_FILES_FOLDER, IMAGE_FILE_NAME);
    const SCRIPT_FILE = readFixture(ADDITIONAL_FILES_FOLDER, SCRIPT_FILE_NAME);
    const STYLES_FILE = readFixture(ADDITIONAL_FILES_FOLDER, STYLES_FILE_NAME);
    const CANONICAL_FILE = readFixture(ADDITIONAL_FILES_FOLDER, CANONICAL_FILE_NAME);

    nock(BASE_URL)
      .get(PAGE)
      .reply(200, MAIN_FILE)
      .get(IMAGE_URL)
      .reply(200, IMAGE_FILE)
      .get(SCRIPT_URL)
      .reply(200, SCRIPT_FILE)
      .get(STYLES_URL)
      .reply(200, STYLES_FILE)
      .get(CANONICAL_URL)
      .reply(200, CANONICAL_FILE);
      
    await pageLoader(PAGE_URL, tmpDirPath);

    const expectedPage = await readFixture('expected.html');
    const actualPage = await fsp.readFile(path.resolve(tmpDirPath, MAIN_FILE_NAME), 'utf8');
    const actualImage = await fsp.readFile(path.resolve(tmpDirPath, ADDITIONAL_FILES_FOLDER, IMAGE_FILE_NAME_TMP), 'utf8');
    const actualScript = await fsp.readFile(path.resolve(tmpDirPath, ADDITIONAL_FILES_FOLDER, SCRIPT_FILE_NAME_TMP), 'utf8');
    const actualStyles = await fsp.readFile(path.resolve(tmpDirPath, ADDITIONAL_FILES_FOLDER, STYLES_FILE_NAME_TMP), 'utf-8');
    const actualCanonical = await fsp.readFile(path.resolve(tmpDirPath, ADDITIONAL_FILES_FOLDER, CANONICAL_FILE_NAME_TMP), 'utf-8');

    expect(actualPage).toEqual(expectedPage);
    expect(actualImage).toEqual(IMAGE_FILE);
    expect(actualScript).toEqual(SCRIPT_FILE);
    expect(actualStyles).toEqual(STYLES_FILE);
    expect(actualCanonical).toEqual(CANONICAL_FILE);
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