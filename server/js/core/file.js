var file = {
  path: "difix",
};

file.read = function (filePath) {
  return new Promise(function (resolve, reject) {
    tizen.filesystem.resolve(
      "documents/" + file.path,
      function (dir) {
        var filedata = dir.resolve(filePath);
        filedata.openStream(
          "r",
          function (fs) {
            var result = "";
            if (filedata.fileSize > 0) {
              result = fs.read(filedata.fileSize);
            }
            fs.close();
            resolve(result);
          },
          function (error) {
            console.log("code : 10 " + error.message);
            resolve(undefined);
          },
          "UTF-8"
        );
      },
      function (error) {
        console.log("code : 11 " + error.message);
        resolve(undefined);
      }
    );
  });
};
