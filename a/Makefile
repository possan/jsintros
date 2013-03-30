all: build/presets.js build/debug.html build/packed.js build/index.html build/crushed.js build/crushed.html reportsizes

reportsizes:
	ls -la build/*.js

clean:
	rm -f build/packed.js
	rm -f build/index.html

build/presets.js: src/preset.js
	node src/preset.js >build/presets.js

build/origwithpreset.js: src/orig.js build/presets.js Makefile
	ls -la src/orig.js
	cat build/presets.js >build/origwithpreset.js
	cat src/orig.js >>build/origwithpreset.js
	ls -la build/origwithpreset.js

build/packed.js: build/origwithpreset.js build/presets.js Makefile
	closure-compiler --compilation_level ADVANCED_OPTIMIZATIONS --externs "externs/w3c_audio.js" --externs "externs/custom.js" --js build/origwithpreset.js >build/packed1.js
	node_modules/uglify-js/bin/uglifyjs build/packed1.js  >build/packed.js
	ls -la build/packed.js

build/crushed.js: build/stripped.js src/crush.js
	node src/crush.js build/stripped.js build/crushed.js

build/stripped.js: build/packed.js Makefile
	# sed 's/var\ //g'
	cat build/packed.js >build/stripped.js
	ls -la build/stripped.js

build/debug.html: build/origwithpreset.js Makefile
	rm -f build/debug.html
	cat shim-head.html >>build/debug.html
	cat build/origwithpreset.js >>build/debug.html
	cat shim-foot.html >>build/debug.html

build/index.html: build/stripped.js Makefile
	rm -f build/index.html
	cat shim-head.html >>build/index.html
	cat build/stripped.js >>build/index.html
	cat shim-foot.html >>build/index.html
	# ls -la build/index.html

build/crushed.html: build/crushed.js Makefile
	rm -f build/crushed.html
	cat shim-head.html >>build/crushed.html
	cat build/crushed.js >>build/crushed.html
	cat shim-foot.html >>build/crushed.html
	# ls -la build/index.html

build: build/debug.html build/index.html build/packed.js Makefile

open: build
	open build/index.html

