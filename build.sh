docker build -t ffmpeg .

docker run --rm -v $(pwd)/public/ffmpeg_build:/ffmpeg_build ffmpeg

mkdir src/ffmpeg_build
mkdir public/static
mkdir public/static/js

echo "/* eslint-disable */" > public/ffmpeg_build/ffmpeg_n.js
cat public/ffmpeg_build/ffmpeg.js >> public/ffmpeg_build/ffmpeg_n.js

mv public/ffmpeg_build/ffmpeg_n.js src/ffmpeg_build/ffmpeg.js

mv public/ffmpeg_build/ffmpeg public/static/js/ffmpeg
mv public/ffmpeg_build/ffmpeg.wasm public/static/js/ffmpeg.wasm
mv public/ffmpeg_build/ffmpeg_g public/static/js/ffmpeg_g

rm -rf public/ffmpeg_build
