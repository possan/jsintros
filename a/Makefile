all: build/debug.html build/packed.js build/index.html

clean:
	rm -f build/packed.js
	rm -f build/index.html

build/packed.js: src/orig.js Makefile
	ls -la src/orig.js
	closure-compiler --compilation_level ADVANCED_OPTIMIZATIONS --externs "externs/w3c_audio.js" --js src/orig.js >build/packed.js
	# cp orig.js build/packed.js
	ls -la build/packed.js

build/stripped.js: build/packed.js Makefile
	cat build/packed.js | \
		sed 's/var\ //g' \
	 	>build/stripped.js
	ls -la build/stripped.js

build/debug.html: src/orig.js Makefile
	rm -f build/debug.html
	cat shim-head.html >>build/debug.html
	cat src/orig.js >>build/debug.html
	cat shim-foot.html >>build/debug.html

build/index.html: build/stripped.js Makefile
	rm -f build/index.html
	cat shim-head.html >>build/index.html
	cat build/stripped.js >>build/index.html
	cat shim-foot.html >>build/index.html
	# ls -la build/index.html

build: build/debug.html build/index.html build/packed.js Makefile

open: build
	open build/index.html

