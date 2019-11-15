const fs = require("fs");

function x264() {
  const config = fs.readFileSync("third_party/x264/configure", "utf-8");
  const index = config.indexOf(`CPU_ENDIAN="little-endian"`);
  fs.writeFileSync(
    "third_party/x264/configure",
    config.slice(0, index) +
      config.slice(index).replace(`$compiler = GNU`, `$compiler = unselected`),
  );
}

function libvpx() {
  const config = fs.readFileSync(
    "third_party/libvpx/build/make/configure.sh",
    "utf-8",
  );
  fs.writeFileSync(
    "third_party/libvpx/build/make/configure.sh",
    config.replace(
      `    *-gcc|generic-gnu)`,
      `    js1)
      case  \${tgt_cc} in
        emcc)
          CC=emcc
          LD=llvm-link
          AR=llvm-ar
          AS=llvm-as
          NM=llvm-nm
          tune_cflags=""
          tune_asflags=""
          disable multithread
          add_cflags -emit-llvm
          HAVE_GNU_STRIP=no
          ;;
        esac
      ;;
    *-gcc|generic-gnu)`,
    ),
  );
}

function ffmpeg() {
  fs.writeFileSync(
    "fftools/ffmpeg.c",
    fs
      .readFileSync("fftools/ffmpeg.c", "utf-8")
      .replace(
        "int main(",
        `
static void init_variables() {
  nb_input_streams  = 0;
  nb_input_files    = 0;
  nb_output_streams = 0;
  nb_output_files   = 0;
  nb_filtergraphs   = 0;
  ffmpeg_exited     = 0;
}

int ffmpeg(`,
      )
      .replace("init_dynload();", "init_variables();init_dynload();"),
  );

  fs.writeFileSync(
    "fftools/ffmpeg.h",
    fs
      .readFileSync("fftools/ffmpeg.h", "utf-8")
      .replace(
        "#endif /* FFTOOLS_FFMPEG_H */",
        "int ffmpeg(int argc, char** argv);\n#endif /* FFTOOLS_FFMPEG_H */",
      ),
  );

  const utils = fs.readFileSync("fftools/cmdutils.c", "utf-8");

  fs.writeFileSync(
    "fftools/cmdutils.c",
    utils
      .replace("program_exit(ret);", "program_exit(ret) ;")
      .replace("exit(ret);", ""),
  );
}

x264();
// libvpx();
ffmpeg();

console.log("docker-init ok");
