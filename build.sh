docker build -t ffmpeg .

docker run --rm -v $(pwd)/public/ffmpeg_build:/ffmpeg_build ffmpeg

mkdir public/static
mkdir public/static/js

echo "/* eslint-disable */" > public/ffmpeg_build/ffmpeg_n.js
cat public/ffmpeg_build/ffmpeg-core.js >> public/ffmpeg_build/ffmpeg_n.js

mv public/ffmpeg_build/ffmpeg_n.js public/static/js/ffmpeg.js
mv public/ffmpeg_build/ffmpeg public/static/js/ffmpeg
mv public/ffmpeg_build/ffmpeg-core.wasm public/static/js/ffmpeg-core.wasm
mv public/ffmpeg_build/ffmpeg_g public/static/js/ffmpeg_g

rm -rf public/ffmpeg_build
