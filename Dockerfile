FROM trzeci/emscripten-slim

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install make -y

WORKDIR /src

COPY ffmpeg /src

RUN emconfigure ./configure \
      --disable-x86asm \
      --nm="llvm-nm -g" \
      --ar=emar \
      --cc=emcc \
      --cxx=em++ \
      --objcc=emcc \
      --dep-cc=emcc \
      --disable-inline-asm \
      --disable-doc \
      --disable-stripping \
      --ranlib="llvm-ranlib"

RUN emmake make -j4

RUN emcc \
  -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample \
  -Qunused-arguments \
  -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil -lm \
  -o ffmpeg.js fftools/ffmpeg_opt.o fftools/ffmpeg_filter.o fftools/ffmpeg_hw.o fftools/cmdutils.o fftools/ffmpeg.o \
  -z \
  -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
  -Oz \
  -s TOTAL_MEMORY=33554432 \
  -s MODULARIZE=1 \
  -s EXPORTED_FUNCTIONS="[_ffmpeg]" \
  -s EXTRA_EXPORTED_RUNTIME_METHODS="[cwrap, FS, getValue, setValue]" \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s ASSERTIONS=1

CMD cp ffmpeg* /ffmpeg_build
