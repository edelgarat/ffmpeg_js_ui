FROM trzeci/emscripten-slim

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install make -y

WORKDIR /src

COPY ffmpeg /src

RUN emconfigure ./configure \
    --disable-x86asm \
    --disable-logging \
    --disable-inline-asm \
    --disable-doc \
    --disable-stripping \
    --nm="llvm-nm -g" \
    --ar=emar \
    --cc=emcc \
    --cxx=em++ \
    --objcc=emcc \
    --dep-cc=emcc \
    --disable-sdl2 \
    --ranlib="llvm-ranlib"

RUN emmake make -j$(grep -c ^processor /proc/cpuinfo)

RUN emcc \
  -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample -Wl, -Qunused-arguments   -o ffmpeg-core.js fftools/ffmpeg_opt.o fftools/ffmpeg_filter.o fftools/ffmpeg_hw.o fftools/cmdutils.o fftools/ffmpeg.o -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil  -lm \
  -s MODULARIZE=1 \
  -s EXPORTED_FUNCTIONS="[_ffmpeg]" \
  -s EXTRA_EXPORTED_RUNTIME_METHODS="[cwrap, FS, getValue, setValue]" \
  -s TOTAL_MEMORY=512MB \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s SAFE_HEAP=1 \
  -O3

CMD cp ffmpeg* /ffmpeg_build
