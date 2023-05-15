import del from "del";

import gulp from "gulp";
import imagemin from "gulp-imagemin";
import gulpLoadPlugins from "gulp-load-plugins";

const plugins = gulpLoadPlugins();

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

gulp.task("minimise:media", (done) => {
  return gulp
    .src("src/media/*.*")
    .pipe(imagemin())
    .on("error", (error) => done(error))
    .pipe(gulp.dest("media"))
    .pipe(plugins.size());
});

gulp.task("minimise:assets", (done) => {
  return gulp
    .src("src/assets/images/*.*")
    .pipe(imagemin())
    .on("error", (error) => done(error))
    .pipe(gulp.dest("assets/images"))
    .pipe(plugins.size());
});

gulp.task("clean:media", () => {
  return del(["./media/*"]);
});
gulp.task("clean:assets", () => {
  return del(["./assets/iamges/*"]);
});

// ----------------------------------------------------------------------------
// Tasks
// ----------------------------------------------------------------------------

// Build
gulp.task(
  "minify",
  gulp.series(
    gulp.parallel(["clean:media", "clean:assets"]),
    gulp.parallel(["minimise:media", "minimise:assets"])
  )
);
