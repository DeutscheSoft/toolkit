all : toolkit.min.js

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
    toolkit/modules/dragcapture.js\
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
    toolkit/widgets/value.js\
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
    toolkit/widgets/label.js\
    toolkit/widgets/knob.js\
    toolkit/widgets/valueknob.js\
    toolkit/widgets/select.js\
    toolkit/widgets/window.js\
    toolkit/widgets/toggle.js\
    toolkit/widgets/multimeter.js

css_input_files = \
    toolkit/styles/toolkit.css \
    toolkit/styles/2013.css \
    toolkit/styles/2013/css/globalcursor.css \
    toolkit/styles/2013/css/tooltip.css \
    toolkit/styles/2013/css/scale.css \
    toolkit/styles/2013/css/graph.css \
    toolkit/styles/2013/css/grid.css \
    toolkit/styles/2013/css/responsehandle.css \
    toolkit/styles/2013/css/circular.css \
    toolkit/styles/2013/css/buttonarray.css \
    toolkit/styles/2013/css/meterbase.css \
    toolkit/styles/2013/css/chart.css \
    toolkit/styles/2013/css/gauge.css \
    toolkit/styles/2013/css/button.css \
    toolkit/styles/2013/css/valuebutton.css \
    toolkit/styles/2013/css/toggle.css \
    toolkit/styles/2013/css/state.css \
    toolkit/styles/2013/css/levelmeter.css \
    toolkit/styles/2013/css/frequencyresponse.css \
    toolkit/styles/2013/css/dynamics.css \
    toolkit/styles/2013/css/responsehandler.css \
    toolkit/styles/2013/css/clock.css \
    toolkit/styles/2013/css/window.css \
    toolkit/styles/2013/css/knob.css \
    toolkit/styles/2013/css/value.css \
    toolkit/styles/2013/css/fader.css \
    toolkit/styles/2013/css/select.css \
    toolkit/styles/2013/css/label.css \
    toolkit/styles/2013/css/container.css \
    toolkit/styles/2013/css/pager.css \
    toolkit/styles/2013/css/expander.css \
    toolkit/styles/2013/css/valueknob.css \
    toolkit/styles/2013/css/multimeter.css \
    toolkit/styles/plain.css \
    toolkit/styles/plain_lime.css \
    toolkit/styles/plain_raspberry.css \
    toolkit/styles/plain/lime.css \
    toolkit/styles/plain/cyan.css \
    toolkit/styles/plain/raspberry.css \
    toolkit/styles/plain/css/globalcursor.css \
    toolkit/styles/plain/css/tooltip.css \
    toolkit/styles/plain/css/scale.css \
    toolkit/styles/plain/css/graph.css \
    toolkit/styles/plain/css/grid.css \
    toolkit/styles/plain/css/responsehandle.css \
    toolkit/styles/plain/css/circular.css \
    toolkit/styles/plain/css/buttonarray.css \
    toolkit/styles/plain/css/meterbase.css \
    toolkit/styles/plain/css/chart.css \
    toolkit/styles/plain/css/gauge.css \
    toolkit/styles/plain/css/button.css \
    toolkit/styles/plain/css/valuebutton.css \
    toolkit/styles/plain/css/toggle.css \
    toolkit/styles/plain/css/state.css \
    toolkit/styles/plain/css/levelmeter.css \
    toolkit/styles/plain/css/frequencyresponse.css \
    toolkit/styles/plain/css/dynamics.css \
    toolkit/styles/plain/css/responsehandler.css \
    toolkit/styles/plain/css/clock.css \
    toolkit/styles/plain/css/window.css \
    toolkit/styles/plain/css/knob.css \
    toolkit/styles/plain/css/value.css \
    toolkit/styles/plain/css/fader.css \
    toolkit/styles/plain/css/select.css \
    toolkit/styles/plain/css/label.css \
    toolkit/styles/plain/css/container.css \
    toolkit/styles/plain/css/pager.css \
    toolkit/styles/plain/css/expander.css \
    toolkit/styles/plain/css/valueknob.css \
    toolkit/styles/plain/css/multimeter.css \

toolkit.min.js:	$(js_input_files) Makefile
	closure-compiler --language_in ECMASCRIPT5_STRICT --create_source_map toolkit.min.map $(js_input_files) > $@

toolkit/styles/2013/css/toolkit.all.css: Makefile
	for file in $(css_input_files); do echo '@import "../../../'"$$file"'";' ; done > $@

.PHONY: jsdoc

jsdoc: Makefile $(js_input_files) doc/jsdoc/conf.json toolkit/styles/2013/css/toolkit.all.css
	jsdoc -u doc/tutorials/ --readme doc/docs/Main.md -t ../jsdoc-toolkit/ -c doc/jsdoc/conf.json -d doc/documentation/ $(js_input_files)
	cp -r toolkit doc/documentation/
