const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');

const efPackage = require('electron-forge/dist/api/package').default;
const efMake = require('electron-forge/dist/api/make').default;
const rimraf = require('rimraf');
const sass = require('node-sass');

const COMPILED_DIR = '.compiled';
const ABS_COMPILED_DIR = path.resolve(process.cwd(), COMPILED_DIR);
const OUT_DIR = path.resolve(process.cwd(), 'out');
const ABS_ELECTRON_SRC = path.resolve(process.cwd(), 'tools/electron/');

const flags = process.argv.slice(2);

clearDir(OUT_DIR)
.then(runBabel)
// .then(compileSass)
.then(() => {
    return flags.includes('--make') ? efMake() : efPackage();
})
.then(() => clearDir(ABS_COMPILED_DIR));

function clearDir(dirname) {
    return new Promise((resolve, reject) => {
        rimraf(dirname, (err) => {
            if(err) reject(err);

            resolve();
        });
    });
}

function runBabel() {
    return new Promise((resolve, reject) => {
        exec(`babel src --out-dir ${COMPILED_DIR} --copy-files`, (err) => {
            if(err) reject(err);

            resolve();
        });
    });
}

// function compileSass() {
//     return new Promise((resolve, reject) => {
//         sass.render({ file: path.resolve(ABS_COMPILED_DIR, 'styles/main.scss') }, (err, result) => {
//             if(err) reject(err);

//             fs.writeFile(path.resolve(ABS_ELECTRON_SRC, 'style.css'), result.css, (err) => {
//                 if(err) reject(err);

//                 resolve();
//             });
//         });
//     });
// }