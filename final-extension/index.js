"use strict"
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, "__esModule", { value: true })
const tl = require("azure-pipelines-task-lib/task")
const axios = require("axios")
function run() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
        const inputString = tl.getInput('ProjectFolder', true);
      // const inputString = "GHAS-FINAL"
      if (inputString == "bad") {
        tl.setResult(tl.TaskResult.Failed, "Bad input was given")
        return
      }
      var execProcess = require("./exec_process.js")

      var cred =
        "{{user.name}}:{{PAT}}"
      var conversion = Buffer.from(cred).toString('base64')

      var body = {
        name: inputString
      }

      let header = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + conversion
        }
      }

      axios
        .post(
          "https://dev.azure.com/{{Organizatoin Name}}/{{Project Name}}/_apis/git/repositories?api-version=7.1-preview.1",
          body,
          header
        )
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
          tl.setResult(tl.TaskResult.Failed, error)
        })

      execProcess.result(
        'rm -rf .git' +
        '&& echo ".git directory deleted."' + 
        '&& git config --global user.email "{{Email Edu}}"'+
        '&& git config --global user.name "{{Name}}"' +
        '&& git init' +
        '&& git remote add origin https://{{Your UserName}}:{{PAT}}@dev.azure.com/{{Organization Name}}/{{Project Name}}/_git/' + inputString +
        '&& git add .' + 
        '&& git commit -m "Initial commit"'+
        '&& git push --force origin master',
        function (err, response) {
          if (!err) {
            console.log(response)
          } else {
            console.log(err)
            tl.setResult(tl.TaskResult.Failed, err)

          }
        }
      )
    } catch (err) {
      tl.setResult(tl.TaskResult.Failed, err.message)
    }
  })
}
run()
