#!/usr/bin/env node

import fs, { readdir } from "fs";
import gradient from "gradient-string";
import readline from "readline";

const inputInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const errorGradient = gradient("#e31010", "#e31010");

const successGradient = gradient("#42f548", "#42f548");

let time = Date.now();

inputInterface.question(
  gradient.pastel.multiline(
    "what is the directory name where node_module are located? \n"
  ),
  async (inputDirectory) => {
    try {
      if (!inputDirectory) {
        console.log(errorGradient("Folder not specified ⨉ ⨉"));
      } else if (inputDirectory === ".") {
        handleFindNodeFolder(inputDirectory);
      } else {
        fs.access(inputDirectory, async (err) => {
          if (err) {
            console.log(
              errorGradient(
                "Directory not found: " + inputDirectory + " " + err.message
              )
            );
          } else {
            await handleFindNodeFolder(inputDirectory);
          }
        });
      }
    } catch (error) {
      console.log(errorGradient(error?.message));
    } finally {
      inputInterface.close();
    }
  }
);

const handleFindNodeFolder = async (source) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        readdir(source, { withFileTypes: true }, (err, files) => {
          if (err) {
            console.log(errorGradient(err?.message));
          } else {
            let data = files
              .filter((dirent) => dirent.isDirectory())
              .map((dirent) => dirent.name);

            // console.log(data);

            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                if (data[i] === "node_modules") {
                  let dirPath = `${source}/${data[i]}`;
                  handleDeleteFolder(dirPath);
                } else {
                  handleFindNodeFolder(`${source}/${data[i]}`);
                }
              }
            } else {
              console.log(successGradient("Checked " + source + " ✓✓ "));
            }
          }
        })
      );
    } catch (error) {
      console.log(errorGradient(error?.message));
    }
  });

// const handleFindNodeFolder = async (source) => {
//   try {
//     readdir(source, { withFileTypes: true }, (err, files) => {
//       if (err) {
//         console.log(errorGradient(err?.message));
//       } else {
//         let data = files
//           .filter((dirent) => dirent.isDirectory())
//           .map((dirent) => dirent.name);

//         // console.log(data);

//         if (data.length > 0) {
//           for (let i = 0; i < data.length; i++) {
//             if (data[i] === "node_modules") {
//               let dirPath = `${source}/${data[i]}`;
//               handleDeleteFolder(dirPath);
//             } else {
//               handleFindNodeFolder(`${source}/${data[i]}`);
//             }
//           }
//         } else {
//           console.log(successGradient("Checked " + source + " ✓✓ "));
//         }
//       }
//     });
//   } catch (error) {
//     console.log(errorGradient(error?.message));
//   }
// };

const loaderAnimation = () => {
  var h = ["|", "/", "-", "\\"];
  let dots = [".", "..", "...", "...."];
  var i = 0;

  return setInterval(() => {
    i = i > 3 ? 0 : i;
    console.log(h[i] + gradient.pastel.multiline(" Deleting" + dots[i]));
    console.clear();
    i++;
    return;
  }, 300);
};

const handleDeleteFolder = (pathToFolder) =>
  new Promise(async (resolve, reject) => {
    try {
      let deletingAnimate = loaderAnimation();

      fs.rm(pathToFolder, { recursive: true, force: true }, (err) => {
        if (err) {
          console.log(errorGradient(err?.message));
        } else {
          clearInterval(deletingAnimate);
          console.log(successGradient("Node_Modules Deleted  ✓✓"));
          console.log(Date.now() - time + " ms");
        }
      });
      resolve();
    } catch (error) {
      console.log(errorGradient(error?.message));
      reject(error);
    }
  });
