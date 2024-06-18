import { deleteAsync } from "del";
import gulp from "gulp";
import imagemin from "gulp-imagemin";

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

gulp.task("minimise:media", (done) => {
  return gulp
    .src("src/media/*.*", { encoding: false })
    .pipe(imagemin())
    .on("error", (error) => done(error))
    .pipe(gulp.dest("media"));
});

gulp.task("minimise:assets", (done) => {
  return gulp
    .src("src/assets/images/*.*", { encoding: false })
    .pipe(imagemin())
    .on("error", (error) => done(error))
    .pipe(gulp.dest("assets/images"));
});

gulp.task("clean:media", () => {
  return deleteAsync(["./media/*"]);
});
gulp.task("clean:assets", () => {
  return deleteAsync(["./assets/iamges/*"]);
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
