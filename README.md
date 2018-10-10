# Dan Buda's Gulp Framework

<kbd>![Image](gulpframework.png)</kbd>

A simple Gulp framework for front-end projects using HTML, Sass and Vanilla JavaScript.

## Features

- Browser "reset" using `normalize.css`
- Minified CSS compiled from Sass
- Minified JavaScript compiled with Babel 7
- Minified images with `imagemin`
- Automatically add browser prefixes with `postcss` and `autoprefixer` (default set to last 2 versions)
- Local server with hot reloading and bypass of unchanged files using `browser-sync`

## How to Use

- Git clone or fork the repository
- `npm install` or `npm i` to install dependencies
- `gulp watch` to watch for any changes to files in the `src` directory and compile them to the `dist` folder
- `gulp serve` to start the local server at `localhost:8080` which watches for file changes in the `src` directory, complies them in the `dist` folder, and hot reloads in the browser. running `gulp serve` should automatically open the project in the browser using the compiled files in `dist`
- Do all of your work in the `src` directory

## Version Information

### 1.0.0

- `gulp` v3.9.1
- `normalize.css` v8.0.0
- Compile `.scss` to CSS with `gulp-sass` v4.0.1, add browser prefixes with `gulp-postcss` v7.0.5 and `autoprefixer` v9.1.5 plugin, and minify with `gulp-clean-css` v3.10.0
- Compile JavaScript with Babel 7 (`gulp-babel` v8.0.0, `@babel/core` v7.1.2, `@babel/preset-env` v7.1.0) and minifiy with `gulp-uglify` v3.0.1
- Minified images with `gulp-imagemin` v4.1.0
- `browser-sync` v2.26.0 for local server and hot reloading of changed files; bypass unchanged files with `gulp-changed` v3.2.0
