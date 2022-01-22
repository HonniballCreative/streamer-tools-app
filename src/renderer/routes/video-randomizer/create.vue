<script>
import { defineComponent } from 'vue'
import { ipcRenderer } from '@/electron'
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'VideoRandomizerCreate',

  data() {
    return {
      formData: {
        version: '3.0.0',
        randomize: 'yes',
        all: 'yes',
        loop: 'yes',
        preventRepeat: 'yes',
        files: [],
      },

      error: {
        status: 'error',
        title: '',
        message: '',
      },

      modalLink: '',
    }
  },

  methods: {
    submitFormData(){
      const convertedFormData = JSON.parse(JSON.stringify(this.formData))
      const promise = ipcRenderer.invoke('create-randomizer-file', convertedFormData)

      promise.then((result) => {
        if(result.status === 'error'){
          this.error = result
          this.errorDialog.show();
          return;
        } else if(result.status === 'cancelled'){
          return;
        }

        this.modalLink = result.savePath
        this.successDialog.show();
      })
    },

    filesSelected(e){
      let files = e.target.files;

      for(let i = 0; i < files.length; i++) {
        this.formData.files.push(files[i].path);
      };

      e.target.value = '';
    },

    removeFile(path){
      const fileIndex = this.formData.files.indexOf(path)
      this.formData.files.splice(fileIndex, 1)
    }
  },

  mounted(){
    this.errorDialog = new Modal(this.$refs['errorDialog'], {
      keyboard: false
    })
    this.successDialog = new Modal(this.$refs['successDialog'], {
      keyboard: false
    })
  },

  unmounted(){
    this.errorDialog.dispose();
    this.successDialog.dispose();
  }
});
</script>


<template>
  <div class="component-container">
    <form id="form">
      <h1>Configure Your New Video Randomizer</h1>

      <p>Fill out the options below and select files that you'd like to include in your video randomizer.</p>

      <h3><i class="me-2 fas fa-exclamation-triangle text-warning"></i>Precautions</h3>

      <ul>
        <li>Moving videos from their location after setting up a video randomizer will cause it to stop playback when it can't locate a video in the list.</li>
      </ul>

      <hr class="my-3">

      <h2>Options</h2>

      <input type="hidden" name="version" v-model="formData.version">

      <div class="mb-3">
        <label class="form-label">Randomize Videos?</label>
        <div class="mb-4">
          <input type="radio" class="btn-check" name="randomize" autocomplete="off" value="yes" id="randomize-yes" v-model="formData.randomize">
          <label class="btn btn-outline-primary mx-1" for="randomize-yes">Yes</label>

          <input type="radio" class="btn-check" name="randomize" autocomplete="off" value="no" id="randomize-no" v-model="formData.randomize">
          <label class="btn btn-outline-danger mx-1" for="randomize-no">No</label>

          <div class="form-text">
            This option will randomly select a video from your list of videos.
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">How many videos do you want the randomizer to play?</label>
        <div class="mb-4">
          <input type="radio" class="btn-check" name="all" autocomplete="off" value="yes" id="all-yes" v-model="formData.all">
          <label class="btn btn-outline-primary mx-1" for="all-yes">All Videos</label>

          <input type="radio" class="btn-check" name="all" autocomplete="off" value="no" id="all-no" v-model="formData.all">
          <label class="btn btn-outline-danger mx-1" for="all-no">One Video Only</label>

          <div class="form-text">
            This option tells the randomizer to eithr play a single video or continue playing through all of your videos until each has been played.
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Loop video(s)?</label>
        <div class="mb-4">
          <input type="radio" class="btn-check" name="loop" autocomplete="off" value="yes" id="loop-yes" v-model="formData.loop">
          <label class="btn btn-outline-primary mx-1" for="loop-yes">Yes</label>

          <input type="radio" class="btn-check" name="loop" autocomplete="off" value="no" id="loop-no" v-model="formData.loop">
          <label class="btn btn-outline-danger mx-1" for="loop-no">No</label>

          <div class="form-text">
            This option will loop through the video(s) after every video in your list has been played. Depending on the "How many..." setting the following will happen:
            <ul class="mb-0">
              <li>If you have "All Videos" selected and this option is set to "Yes"; playback will start over once each video has been played once.</li>
              <li>If you have "One Video Only" selected and this setting on "Yes"; a single video will loop forever.</li>
              <li>If you have "All Videos" selected and this option is set to "No"; playback will stop once each video has been played once.</li>
              <li>If you have "One Video Only" selected and this setting on "No"; a single video will play once.</li>
            </ul>
            <em>Note: For ALL scenarios you will need to either hide/show the browser source OR switch to an alternate scene and return for the randomizer to restart.</em>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Attempt to prevent starting video repeats?</label>
        <div class="mb-4">
          <input type="radio" class="btn-check" name="preventRepeat" autocomplete="off" value="yes" id="preventRepeat-yes" v-model="formData.preventRepeat">
          <label class="btn btn-outline-primary mx-1" for="preventRepeat-yes">Yes</label>

          <input type="radio" class="btn-check" name="preventRepeat" autocomplete="off" value="no" id="preventRepeat-no" v-model="formData.preventRepeat">
          <label class="btn btn-outline-danger mx-1" for="preventRepeat-no">No</label>

          <div class="form-text">
            This option will attempt to prevent videos from repeating when the randomizer restarts. <em>Please note: this uses the browser source <code>localStorage</code> and therefor may not work depending on your system and version of OBS Studio.</em>
          </div>
        </div>
      </div>

      <hr class="my-3">

      <h3>Included Video Files &ndash; <span class="text-muted">{{formData.files.length}} videos</span></h3>

      <p>Select the video files you would like included in your randomizer.</p>

      <p class="text-danger">Note: Drag and drop is currently <strong>NOT</strong> supported.</p>

      <div class="input-group">
        <input type="file" class="form-control" ref="filepicker" accept="video/*" multiple @change="filesSelected"/>
        <button class="btn btn-outline-secondary" type="button" @click="formData.files = []">Clear</button>
      </div>

      <ul class="list-group mt-3" id="listing">
        <li class="list-group-item" v-for="filePath in formData.files" :key="filePath">
          <i class="fas fa-times text-danger cursor-pointer p-2"
            @click="removeFile(filePath)"
          ></i>

          {{filePath}}
        </li>
      </ul>

      <div style="height: 100px;"></div>

      <nav class="navbar fixed-bottom navbar-light bg-light">
        <div class="container-fluid justify-content-end">
          <router-link :to="{ name: 'VideoRandomizer' }" class="me-auto btn btn-outline-primary rounded-pill"><i class="me-2 fas fa-chevron-double-left"></i>Back</router-link>

          <button type="button" class="btn btn-primary rounded-pill" @click="submitFormData"><i class="me-2 fas fa-save"></i>Create</button>
        </div>
      </nav>
    </form>

    <div class="modal fade" ref="errorDialog" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{error.title}}</h5>
          </div>
          <div class="modal-body">
            <p>{{error.message}}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Ok</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" ref="successDialog" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Your randomizer has been saved!</h5>
          </div>
          <div class="modal-body">
            <p><strong>Your Browser Source URL:</strong></p>
            <p class="font-monospace text-danger text-break border p-1 rounded">file:///{{modalLink.replace(/\\{1,2}/g, '/')}}</p>
            <p>We've also copied the URL for your browser source onto your clipboard.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">

</style>
