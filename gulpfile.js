const gulp = require( 'gulp' ) ;
const nunjucks = require( 'gulp-nunjucks' ) ;
const data = require('./data.js')

let COMPILE = {
    SRC: 'templates/*.html',
    DEST: '.'
} ;

gulp.task( 'default', () => 
    gulp.src( COMPILE.SRC )
        .pipe( nunjucks.compile({ data: data }) )
        .pipe( gulp.dest( COMPILE.DEST ) )
) ;