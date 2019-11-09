docker build -t ffmpeg .

docker run --rm -v $(pwd)/public/ffmpeg_build:/ffmpeg_build ffmpeg

mkdir public/static

mv public/ffmpeg_build public/static/js
