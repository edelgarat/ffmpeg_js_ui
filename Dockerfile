FROM trzeci/emscripten:latest

RUN mkdir -p /usr/share/man/man1

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install make -y && \
    apt-get install default-jdk -y

WORKDIR /src

RUN git clone https://git.ffmpeg.org/ffmpeg.git . --depth 1

COPY docker-init.js /src

RUN mkdir build

RUN mkdir third_party

WORKDIR /src/third_party

RUN git clone https://code.videolan.org/videolan/x264.git x264 --depth 1

WORKDIR /src

RUN node docker-init.js

WORKDIR /src/third_party/x264

RUN emconfigure ./configure --disable-asm --disable-thread --prefix=/src/build

RUN emmake make install-lib-static

WORKDIR /src

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
    --ranlib="llvm-ranlib" \
    --enable-gpl \
    --enable-libx264 \
    --disable-pthreads \
    --disable-ffprobe \
    --disable-ffplay \
    --disable-ffmpeg \
    --prefix=/src/build \
    --extra-cflags="-I/src/build/include" \
    --extra-cxxflags="-I/src/build/include" \
    --extra-ldflags="-L/src/build/lib"

RUN emmake make -j$(grep -c ^processor /proc/cpuinfo)

RUN mkdir dist

RUN emcc \
    -I. -I./fftools -I/src/build/include \
    -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample -Llibpostproc -L/src/build/lib \
    -Qunused-arguments \
    -o dist/ffmpeg-core.js fftools/ffmpeg_opt.c fftools/ffmpeg_filter.c fftools/ffmpeg_hw.c fftools/cmdutils.c fftools/ffmpeg.c \
    -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil -lpostproc -lm -lx264 \
    -s MODULARIZE=1 \
    -s EXPORTED_FUNCTIONS="[_ffmpeg]" \
    -s EXTRA_EXPORTED_RUNTIME_METHODS="[cwrap, FS, getValue, setValue]" \
    -s TOTAL_MEMORY=512MB \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s BUILD_AS_WORKER=1 \
    -s SAFE_HEAP=1 \
    -s ASSERTIONS=1 \
    -s USE_SDL=2 \
    -O3

CMD cp dist/* /ffmpeg_build
