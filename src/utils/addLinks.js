import path from 'path';
import * as cheerio from 'cheerio';
import { getFileName } from './getFileName.js';
import { getLink } from './getLink.js';
import { TAGS } from './constants.js';

export const addLinks = ({ page, directory, url }) => {
    const result = cheerio.load(page);
    TAGS.forEach((src) => {
        const links = result('html').find(src.name);
        links.each((i) => {
            if (result(links[i]).attr(src.src)) {
                const ext = path.extname(result(links[i]).attr(src.src));
                const currentLink = getLink(url, result(links[i]).attr(src.src));
                if (currentLink) {
                    const localHref = path.join(directory, `${getFileName(currentLink)}${ext || '.html'}`);
                    result(links[i]).attr(src.src, localHref);
                }
            }
        });
    });
    return result.html();
};