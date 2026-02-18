const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const routeFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.routes.js'));

routeFiles.forEach(file => {
    try {
        console.log(`Checking ${file}...`);
        const route = require(`./${file}`);
        if (typeof route !== 'function' && !(route instanceof express.Router)) {
            console.error(`ERROR: ${file} does not export a router or function! Value:`, route);
        }
    } catch (err) {
        console.error(`ERROR requiring ${file}:`, err.message);
    }
});
