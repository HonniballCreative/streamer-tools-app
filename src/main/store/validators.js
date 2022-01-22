const fs = require('fs')

module.exports = {
  "video-randomizer"(prefs){
    if(prefs.files.length > 0){
      // Validate the files exist.
      let validatedFiles = []
      prefs.files.forEach(file => {
        file.valid = true
        if(!fs.existsSync(file.path)){
          file.valid = false
        }
        validatedFiles.push(file)
      })
      prefs.files = validatedFiles;
    }

    return prefs
  }
}
