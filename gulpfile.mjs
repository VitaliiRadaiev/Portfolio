import gulp from "gulp";
const { src, dest, task } = gulp;
import fs from "fs";
import sync from "browser-sync";
import fileinclude from "gulp-file-include";
import { deleteAsync } from "del";
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import postcss from 'gulp-postcss';
import sortMediaQueries from 'postcss-sort-media-queries';
import newer from "gulp-newer";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import tailwindcss from "tailwindcss";
import concat from "gulp-concat";

const project_name = "dist";
const src_folder = "src";


const path = {
	build: {
		html: project_name + "/",
		js: project_name + "/assets/js/",
		css: project_name + "/assets/css/",
		images: project_name + "/assets/images/",
		icons: project_name + "/assets/icons/",
		videos: project_name + "/assets/videos/",
		fonts: project_name + "/assets/fonts/"
	},
	src: {
		html: [src_folder + "/*.{html,json}", "!" + src_folder + "/_*.html"],
		js: [src_folder + "/assets/js/app.js", src_folder + "/assets/js/vendors.js"],
		css: src_folder + "/assets/scss/style.scss",
		images: [src_folder + "/assets/images/**/*.{jpg,png,svg,gif,ico,webp}", "!**/favicon.*"],
		icons: [src_folder + "/assets/icons/**/*.{jpg,png,svg,gif,ico,webp}", "!**/favicon.*"],
		videos: [src_folder + "/assets/videos/**/*.mp4", "!**/favicon.*"],
		fonts: src_folder + "/assets/fonts/*.{ttf,woff,woff2,eot,svg}"
	},
	watch: {
		html: src_folder + "/**/**/*.html",
		js: src_folder + "/**/**/**/*.js",
		css: src_folder + "/**/**/**/*.scss",
		images: [src_folder + "/assets/images/**/*.{jpg,png,svg,gif,ico,webp}", "!**/favicon.*"],
		icons: [src_folder + "/assets/icons/**/*.{jpg,png,svg,gif,ico,webp}", "!**/favicon.*"],
		videos: [src_folder + "/assets/videos/**/*.mp4", "!**/favicon.*"],
		fonts: src_folder + "/assets/fonts/*.{ttf,woff,woff2,eot,svg}"
	},
	clean: "./" + project_name + "/"
};


export function clean() {
	return deleteAsync([path.clean]);
}

export function server(done) {
	sync.init({
		server: {
			baseDir: "./" + project_name + "/"
		},
		notify: false,
		port: 3000,
	});
}

export const refresh = (done) => {
    sync.reload();
    done();
}

export function html() {
	return src(path.src.html, { encoding: false })
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(sync.stream());
}

task('json', html);

export function css() {
	return src(path.src.css, {})
		.pipe(plumber({
			errorHandler: notify.onError({
				title: "SCSS Error",
				message: "Error: <%= error.message %>"
			})
		}))
		.pipe(
			sass({
				outputStyle: "expanded"
			})
		)
		.pipe(
			postcss([
				tailwindcss('./tailwind.config.js'), 
				sortMediaQueries()
			])
		)
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			}),
		)
		.pipe(concat({ path: "style.css" }))
		.pipe(dest(path.build.css))
		.pipe(sync.stream());
}

export function js() {
	return src(path.src.js, {})
	.pipe(fileinclude())
	.pipe(gulp.dest(path.build.js))
	.pipe(sync.stream())
}

export function images() {
	return src(path.src.images, { encoding: false })
		.pipe(plumber())
		.pipe(newer(path.build.images))
		.pipe(dest(path.build.images))
		.pipe(sync.stream())
}

export function pdf() {
	return src('src/*.pdf', { encoding: false })
		.pipe(plumber())
		.pipe(newer('dist'))
		.pipe(dest('dist'))
}

export function icons() {
	return src(path.src.icons, { encoding: false })
		.pipe(plumber())
		.pipe(newer(path.build.icons))
		.pipe(dest(path.build.icons))
		.pipe(sync.stream())
}

export function videos() {
	return src(path.src.videos, { encoding: false })
		.pipe(plumber())
		.pipe(newer(path.build.videos))
		.pipe(dest(path.build.videos))
		.pipe(sync.stream())
}

export function fonts() {
	return src(path.src.fonts, { encoding: false })
		.pipe(plumber())
		.pipe(dest(path.build.fonts));
}


function fontstyle(done) {
	const fontsFilePath = `${src_folder}/assets/scss/fonts.scss`;

	if (!fs.existsSync(fontsFilePath)) {
		fs.writeFileSync(fontsFilePath, '');
	}

	let fileContent = fs.readFileSync(fontsFilePath, 'utf-8');

	if (fileContent === '') {
		fs.readdir(path.build.fonts, (err, items) => {
			if (err) {
				console.error('Error reading fonts directory:', err);
				done();
				return;
			}

			if (items) {
				let cFontname;
				items.forEach(item => {
					let fontname = item.split('.')[0];
					if (cFontname !== fontname) {
						fs.appendFileSync(fontsFilePath, `@include font("${fontname}", "${fontname}", "400", "normal");\r\n`);
					}
					cFontname = fontname;
				});
			}
			done();
		});
	} else {
		done();
	}
}

export function watch() {
	gulp.watch([path.watch.html], gulp.series(html, css));
	gulp.watch([path.watch.css], gulp.series(css, refresh));
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.images], images);
	gulp.watch([path.watch.icons], icons);
	gulp.watch([path.watch.videos], videos);
	gulp.watch([path.watch.fonts], fonts);
}

export function build(done) {
    gulp.series(
        clean,
        gulp.parallel(
            html,
            js,
            images,
            icons,
			videos,
            fonts,
			pdf
        ),
		css,
        fontstyle
    )(done);
}

export default gulp.series(
    build,
    gulp.parallel(
        watch,
        server
    )
);
