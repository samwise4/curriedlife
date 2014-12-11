curriedlife
===========

Source code to my website, curriedlife.com. Specifically, it's a theme for the [ghost](https://ghost.org/) blogging platform. It was made as an experiment and still needs lots of work from me! It is only on GitHub for the curious, and maybe as a way to encourage me to go back and resume improvements.


Development Requirements
-------------------------
The site was originally set up to compile all LESS stylesheets to `%filename%.css`.

Javascript files are minified into one file via Uglify.js: `debounce.js lib/ajaxify.min.js flowtype-mod.js lib/fastclick.js lib/scrollspy.js lib/jquery.smooth-scroll.js lib/masonry.pkgd.min.js lib/jquery.fancybox.js infinitescroll.js main.js -o main.merge.min.js`

Kids, use [Bower](http://bower.io/)! It saves lives! It means you don't have to add front-end dependencies to source control!