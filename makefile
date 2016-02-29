all : toolkit.all.js toolkit/styles/css/toolkit.all.css toolkit.min.js

js_input_files = \
    toolkit/polyfill/raf.js\
    toolkit/G.js\
    toolkit/toolkit.js\
    toolkit/implements/base.js\
    toolkit/implements/audiomath.js\
    toolkit/implements/anchor.js\
    toolkit/implements/ranges.js\
    toolkit/implements/globalcursor.js\
    toolkit/implements/ranged.js\
    toolkit/implements/warning.js\
    toolkit/implements/gradient.js\
    toolkit/implements/notes.js\
    toolkit/widgets/widget.js\
    toolkit/widgets/tooltips.js\
    toolkit/modules/grid.js\
    toolkit/modules/range.js\
    toolkit/modules/scale.js\
    toolkit/modules/scrollvalue.js\
    toolkit/modules/graph.js\
    toolkit/modules/circular.js\
    toolkit/modules/filter.js\
    toolkit/modules/resize.js\
    toolkit/modules/responsehandle.js\
    toolkit/modules/eqband.js\
    toolkit/modules/dragvalue.js\
    toolkit/modules/drag.js\
    toolkit/widgets/container.js\
    toolkit/widgets/root.js\
    toolkit/widgets/button.js\
    toolkit/widgets/valuebutton.js\
    toolkit/widgets/buttonarray.js\
    toolkit/widgets/clock.js\
    toolkit/widgets/state.js\
    toolkit/widgets/pager.js\
    toolkit/widgets/expander.js\
    toolkit/widgets/meterbase.js\
    toolkit/widgets/levelmeter.js\
    toolkit/widgets/chart.js\
    toolkit/widgets/dynamics.js\
    toolkit/widgets/gauge.js\
    toolkit/widgets/frequencyresponse.js\
    toolkit/widgets/responsehandler.js\
    toolkit/widgets/equalizer.js\
    toolkit/widgets/fader.js\
    toolkit/widgets/value.js\
    toolkit/widgets/label.js\
    toolkit/widgets/knob.js\
    toolkit/widgets/valueknob.js\
    toolkit/widgets/select.js\
    toolkit/widgets/window.js\
    toolkit/widgets/toggle.js

css_input_files = \
    toolkit/styles/css/toolkit.css \
    toolkit/styles/css/globalcursor.css \
    toolkit/styles/css/tooltip.css \
    toolkit/styles/css/scale.css \
    toolkit/styles/css/graph.css \
    toolkit/styles/css/grid.css \
    toolkit/styles/css/responsehandle.css \
    toolkit/styles/css/circular.css \
    toolkit/styles/css/buttonarray.css \
    toolkit/styles/css/meterbase.css \
    toolkit/styles/css/chart.css \
    toolkit/styles/css/gauge.css \
    toolkit/styles/css/button.css \
    toolkit/styles/css/valuebutton.css \
    toolkit/styles/css/toggle.css \
    toolkit/styles/css/state.css \
    toolkit/styles/css/levelmeter.css \
    toolkit/styles/css/frequencyresponse.css \
    toolkit/styles/css/dynamics.css \
    toolkit/styles/css/responsehandler.css \
    toolkit/styles/css/clock.css \
    toolkit/styles/css/window.css \
    toolkit/styles/css/knob.css \
    toolkit/styles/css/value.css \
    toolkit/styles/css/fader.css \
    toolkit/styles/css/select.css \
    toolkit/styles/css/label.css \
    toolkit/styles/css/container.css \
    toolkit/styles/css/pager.css \
    toolkit/styles/css/expander.css \
    toolkit/styles/css/valueknob.css \

toolkit.min.js:	$(js_input_files) makefile
	closure-compiler --language_in ECMASCRIPT5_STRICT --create_source_map toolkit.min.map $(js_input_files) > $@

toolkit.all.js: makefile
	echo "(function(){" > $@
	echo "var current_script = document.currentScript || (function() { var a = document.getElementsByTagName('script'); return a[a.length - 1]; })();" >> $@
	echo "var toolkit_base_dir = current_script.src;" >> $@
	echo "toolkit_base_dir = toolkit_base_dir.split('/');" >> $@
	echo "toolkit_base_dir = toolkit_base_dir.slice(0, toolkit_base_dir.length-1).join('/');" >> $@
	for file in $(js_input_files); do echo 'document.writeln("'"<script src='"'"'" + toolkit_base_dir + "'"'"/$$file'></script>"'");'; done >> $@
	echo "})();" >> $@

toolkit/styles/css/toolkit.all.css: makefile
	for file in $(css_input_files); do echo '@import "../../../'"$$file"'";' ; done > $@

.PHONY: jsdoc
jsdoc: makefile $(js_input_files) jsdoc/conf.json toolkit.all.js toolkit/styles/css/toolkit.all.css
	jsdoc -u tutorials/ --readme docs/Main.md -t ../jsdoc-toolkit/ -c jsdoc/conf.json $(js_input_files)
	cp -r images/ out/
	cp -r toolkit.all.js toolkit/ out/
