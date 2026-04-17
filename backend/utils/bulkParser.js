const fs = require('fs');
const path = require('path');

/**
 * Parse JSON file for bulk product upload
 * @param {Buffer} fileBuffer - File content as buffer
 * @returns {Array} Array of product objects
 */
const parseJSON = (fileBuffer) => {
    try {
        const jsonString = fileBuffer.toString('utf-8');
        const data = JSON.parse(jsonString);

        // Handle both array and object with data property
        if (Array.isArray(data)) {
            return data;
        } else if (data.products && Array.isArray(data.products)) {
            return data.products;
        } else if (data.data && Array.isArray(data.data)) {
            return data.data;
        } else {
            throw new Error('JSON must contain an array of products or object with products/data property');
        }
    } catch (error) {
        throw new Error(`JSON Parse Error: ${error.message}`);
    }
};

/**
 * Parse CSV file for bulk product upload
 * @param {Buffer} fileBuffer - File content as buffer
 * @returns {Array} Array of product objects
 */
const parseCSV = (fileBuffer) => {
    try {
        const csvString = fileBuffer.toString('utf-8');
        const lines = csvString.trim().split('\n');

        if (lines.length < 2) {
            throw new Error('CSV must have header row and at least one data row');
        }

        // Parse header
        const headers = lines[0]
            .split(',')
            .map(header => header.trim().toLowerCase());

        // Parse rows
        const products = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines

            // Handle quoted fields
            const values = parseCSVLine(line);

            if (values.length !== headers.length) {
                console.warn(`Row ${i + 1} has mismatched columns, skipping`);
                continue;
            }

            const product = {};
            headers.forEach((header, index) => {
                product[header] = values[index].trim();
            });

            products.push(product);
        }

        return products;
    } catch (error) {
        throw new Error(`CSV Parse Error: ${error.message}`);
    }
};

/**
 * Parse CSV line handling quoted fields
 * @param {string} line - CSV line
 * @returns {Array} Array of values
 */
const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current);
    return values;
};

/**
 * Parse Excel file for bulk product upload
 * @param {Buffer} fileBuffer - File content as buffer
 * @returns {Array} Array of product objects
 */
const parseExcel = async (fileBuffer) => {
    try {
        const XLSX = require('xlsx');

        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            throw new Error('No sheets found in Excel file');
        }

        const worksheet = workbook.Sheets[sheetName];
        const products = XLSX.utils.sheet_to_json(worksheet);

        if (products.length === 0) {
            throw new Error('No data found in Excel file');
        }

        // Normalize keys to lowercase
        return products.map(product => {
            const normalized = {};
            Object.keys(product).forEach(key => {
                normalized[key.toLowerCase()] = product[key];
            });
            return normalized;
        });
    } catch (error) {
        throw new Error(`Excel Parse Error: ${error.message}`);
    }
};

/**
 * Parse ZIP file and extract all supported files
 * @param {Buffer} fileBuffer - File content as buffer
 * @returns {Array} Array of product objects from all files
 */
const parseZIP = async (fileBuffer) => {
    try {
        const AdmZip = require('adm-zip');

        const zip = new AdmZip(fileBuffer);
        const zipEntries = zip.getEntries();

        let allProducts = [];

        for (const entry of zipEntries) {
            if (entry.isDirectory) continue;

            const fileName = entry.name.toLowerCase();
            const fileContent = entry.getData();

            try {
                if (fileName.endsWith('.json')) {
                    const products = parseJSON(fileContent);
                    allProducts = allProducts.concat(products);
                } else if (fileName.endsWith('.csv')) {
                    const products = parseCSV(fileContent);
                    allProducts = allProducts.concat(products);
                } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
                    const products = await parseExcel(fileContent);
                    allProducts = allProducts.concat(products);
                }
            } catch (error) {
                console.warn(`Error parsing ${entry.name}: ${error.message}`);
            }
        }

        if (allProducts.length === 0) {
            throw new Error('No valid data files found in ZIP');
        }

        return allProducts;
    } catch (error) {
        throw new Error(`ZIP Parse Error: ${error.message}`);
    }
};

/**
 * Parse any supported file format
 * @param {Buffer} fileBuffer - File content as buffer
 * @param {string} fileExtension - File extension (.json, .csv, .xlsx, .zip)
 * @returns {Array} Array of product objects
 */
const parseFile = async (fileBuffer, fileExtension) => {
    const ext = fileExtension.toLowerCase();

    switch (ext) {
        case 'json':
            return parseJSON(fileBuffer);
        case 'csv':
            return parseCSV(fileBuffer);
        case 'xlsx':
        case 'xls':
            return await parseExcel(fileBuffer);
        case 'zip':
            return await parseZIP(fileBuffer);
        default:
            throw new Error(`Unsupported file format: ${ext}`);
    }
};

module.exports = {
    parseJSON,
    parseCSV,
    parseExcel,
    parseZIP,
    parseFile
};
