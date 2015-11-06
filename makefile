all : documentation toolkit.min.js

documentation :
	generator/items.pike

js_input_files = \
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
    toolkit/widgets/button.js\
    toolkit/widgets/valuebutton.js\
    toolkit/widgets/buttonarray.js\
    toolkit/widgets/clock.js\
    toolkit/widgets/state.js\
    toolkit/widgets/pager.js\
    toolkit/widgets/meterbase.js\
    toolkit/widgets/levelmeter.js\
    toolkit/widgets/chart.js\
    toolkit/widgets/dynamics.js\
    toolkit/widgets/keyboard.js\
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

toolkit.min.js:	$(js_input_files) makefile
	closure-compiler --language_in ECMASCRIPT5_STRICT $(js_input_files) > $@
