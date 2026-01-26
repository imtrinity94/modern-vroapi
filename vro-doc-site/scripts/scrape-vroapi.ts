
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const BASE_URL = 'https://www.vroapi.com';

// Add custom agent to ignore SSL errors for old websites
const agent = new https.Agent({
    rejectUnauthorized: false
});
axios.defaults.httpsAgent = agent;

interface ScrapedMethod {
    name: string;
    parameters: string;
    returnType: string;
    description: string;
}

interface ScrapedAttribute {
    name: string;
    type: string;
    description: string;
}

interface ScrapedClass {
    name: string;
    description: string;
    methods: ScrapedMethod[];
    attributes: ScrapedAttribute[];
}

interface ScrapedPlugin {
    name: string;
    classes: ScrapedClass[];
}

async function scrapeClassPage(url: string): Promise<ScrapedClass> {
    console.log(`  Scraping class: ${url}`);
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // More robust way to get title
    const className = $('h1').text().trim() || url.split('/').pop() || 'Unknown';

    // Description: Look for text nodes or paragraphs before the first H2
    let description = '';
    const firstH2 = $('h2').first();
    let current = $('h1').next();
    while (current.length && !current.is('h2')) {
        const text = current.text().trim();
        if (text) description += text + ' ';
        current = current.next();
    }

    const attributes: ScrapedAttribute[] = [];
    const methods: ScrapedMethod[] = [];

    $('h2').each((_, element) => {
        const headerText = $(element).text().toLowerCase();
        const table = $(element).next('table');

        if (headerText.includes('attributes')) {
            table.find('tr').each((_, tr) => {
                const tds = $(tr).find('td');
                if (tds.length >= 2) {
                    attributes.push({
                        name: tds.eq(0).text().trim(),
                        type: tds.eq(1).text().trim(),
                        description: tds.eq(2).text().trim()
                    });
                }
            });
        } else if (headerText.includes('methods')) {
            table.find('tr').each((_, tr) => {
                const tds = $(tr).find('td');
                if (tds.length >= 2) {
                    const methodSig = tds.eq(0);
                    // Name is usually the first link or text before (
                    const rawSig = methodSig.text().trim();
                    const name = methodSig.find('a').first().text().trim() || rawSig.split('(')[0].trim();
                    const params = rawSig.includes('(') ? '(' + rawSig.split('(').slice(1).join('(') : '()';

                    methods.push({
                        name,
                        parameters: params,
                        returnType: tds.eq(1).text().trim(),
                        description: ''
                    });
                }
            });
        }
    });

    return {
        name: className,
        description: description.trim(),
        attributes,
        methods
    };
}

async function scrapePlugin(pluginUrl: string): Promise<ScrapedPlugin> {
    console.log(`Starting scraper for: ${pluginUrl}`);
    const { data: html } = await axios.get(pluginUrl);
    const $ = cheerio.load(html);

    const pluginName = $('h1').text().trim().replace(/^Plugin\s+/i, '') || 'Unknown Plugin';
    const classLinks: string[] = [];

    $('table tr td a[href^="/Class/"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
            classLinks.push(BASE_URL + href);
        }
    });

    const classes: ScrapedClass[] = [];
    for (const link of classLinks) {
        try {
            const classData = await scrapeClassPage(link);
            classes.push(classData);
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error(`Failed to scrape ${link}:`, error);
        }
    }

    return {
        name: pluginName,
        classes
    };
}

const targetUrl = process.argv[2] || 'https://www.vroapi.com/Plugin/Intrinsics/1.0.0';
const outputName = targetUrl.split('/').filter(Boolean).pop() + '.json';

scrapePlugin(targetUrl).then(data => {
    const outputDir = path.resolve(process.cwd(), 'scraped_data');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(path.join(outputDir, outputName), JSON.stringify(data, null, 2));
    console.log(`Done! Data saved to scraped_data/${outputName}`);
}).catch(err => {
    console.error('Scraper failed:', err);
});
