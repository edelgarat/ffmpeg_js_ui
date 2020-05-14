## FFMPEG webassembly demo

For build "wasm" file, you need to run the command below

`./build`

This command runs bash script, which runs build in docker (check Dockerfile for more information)

As a result of this command, two files will be created (.js and .wasm) in "public/static/js" folder

---

You can run the app in development mode:

`npm start`

In production mode:

`npm run build` and `npm run serve`
