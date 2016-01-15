# ![toolkit](images/toolkit.png)

toolkit is a JavaScript widget library with special focus on building
low latency user interfaces for audio applications. It contains a wide range
of widgets such as faders, knobs, levelmeters and equalizers.

## Design Goals

toolkit is written in pure JavaScript and has no external dependencies.
It is supposed to run in browsers which support ECMAScript 5 including
IE9. toolkit was designed to be lightweight and fast while keeping the
full flexibility which comes with CSS. toolkit widgets offer consistent
and intuitive APIs.

## Demo and Documentation

The complete API documentation can be found at [http://deuso.de/toolkit/docs/].
The documentation contains interactive examples for many Widgets.

Alternatively, the documentation can be directly built from the source code.
Simple run `make documentation`. Note that the documentation generator is
written in the [Pike](http://pike.lysator.liu.se/) programming language.
Once the documentation has been successfully extracted, simply navigate a
browser to the file `index.html`.

## License

toolkit is released unter the the terms of the GPLv3. See the `COPYING`
file for details.

Copyright (c) 2013-2016 Markus Schmidt <markus@deuso.de>

Copyright (c) 2014-2016 Arne Goedeke <arne@deuso.de>
