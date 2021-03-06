<script>
import { defineComponent } from 'vue'
import { ipcRenderer } from '@/electron'
import ModalDialog from '@/components/modal-dialog.vue'

export default defineComponent({
  name: 'VideoRandomizerCreate',

  components: {
    ModalDialog,
  },

  data() {
    return {
      loading: false,

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
      this.loading = 'Creating Randomizer'

      const convertedFormData = JSON.parse(JSON.stringify(this.formData))
      const promise = ipcRenderer.invoke('create-randomizer-file', convertedFormData)

      promise.then((result) => {
        this.loading = false

        if(result.status === 'error'){
          this.error = result
          this.$refs['error-dialog'].show();
          return;
        } else if(result.status === 'cancelled'){
          return;
        }

        this.modalLink = result.savePath
        this.$refs['success-dialog'].show();
      })
    },

    dropFile(e){
      const files = e.dataTransfer.files
      for(let i = 0; i < files.length; i++) {
        this.formData.files.push(files[i].path);
      };
    },

    filesSelected(e){
      let files = e.target.files;

      for(let i = 0; i < files.length; i++) {
        this.formData.files.push(files[i].path);
      };

      e.target.value = '';
    },

    removeFile(e, path){
      const btn = e.target
      const li = btn.parentNode
      li.classList.remove('animate__fadeInUp')
      li.classList.add('animate__animated', 'animate__bounceOutLeft')
      setTimeout(() => {
        const fileIndex = this.formData.files.indexOf(path)
        this.formData.files.splice(fileIndex, 1)
      }, 1000)
    },

    clearAll(e){
      const list = this.$refs['file-list']
      list.classList.add('animate__animated', 'animate__bounceOutLeft')
      setTimeout(() => {
        this.formData.files = []
        list.classList.remove('animate__animated', 'animate__bounceOutLeft')
      }, 1000)
    }
  },
});
</script>


<template>
  <div class="component-container" @drop.prevent="dropFile" @dragover.prevent>
    <app-loader v-if="loading" :msg="loading" />

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

      <h3>Included Videos <span class="text-muted fw-normal fsp-70">&ndash; {{formData.files.length}} videos</span></h3>

      <p>Select the video files you would like included in your randomizer.</p>

      <h6>Hints:</h6>
      <ul class="fsp-90">
        <li>You can select files from multiple locations by selecting files then clicking "Choose Files" as many times as you'd like.</li>
        <li>You are allowed to select multiple files.</li>
        <li>When choosing files you can select a <em>range</em> of files by <em>clicking</em> on the first file in a list then <em>holding the shift key and clicking</em> on the last file within that list.</li>
        <li>
          When choosing files you can select multiple <em>disconnected</em> files by:
          <ul class="mb-0">
            <li>Windows/Linux: <em>clicking</em> on any file in the folder then <em>holding the control key and clicking</em> on multiple other files.</li>
            <li>Mac: <em>clicking</em> on any file in the folder then <em>holding the command (apple) key and clicking</em> on multiple other files.</li>
          </ul>
          <em>Warning: After multiple files are selected and you click on another file <strong>without</strong> holding the associated key you will lose your selection and have to start from a single selected file.</em>
        </li>
      </ul>

      <div class="input-group">
        <input type="file" class="form-control" ref="filepicker" accept="video/*" multiple @change="filesSelected"/>
        <button class="btn btn-outline-danger" type="button" @click="clearAll">Remove All</button>
      </div>

      <p class="text-info bg-info bg-opacity-10 border border-info rounded fs-4 fw-normal my-3 p-3 d-flex align-items-center justify-content-center" style="height: 100px;">
        <i class="fas fa-chevron-square-down me-3 animate__animated animate__heartBeat animate__slower animate__infinite"></i>Drag and drop files here...
      </p>

      <ul class="list-group mt-3" ref="file-list">
        <li class="list-group-item animate__animated animate__fadeInUp" v-for="filePath in formData.files" :key="filePath">
          <i class="fas fa-times text-danger cursor-pointer p-2"
            @click="removeFile($event, filePath)"
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

    <modal-dialog
      ref="error-dialog"
      :title="error.title"
      :message="error.message"
      btnColor="danger"
    />

    <modal-dialog
      ref="success-dialog"
      title="Your randomizer has been saved!"
      okText="Close"
    >
      <template v-slot:body>
        <p><strong>Your Browser Source URL:</strong></p>
        <p class="font-monospace text-primary text-break border p-1 rounded">file:///{{modalLink.replace(/\\{1,2}/g, '/')}}</p>
        <p>We've also copied the URL for your browser source onto your clipboard.</p>
      </template>
    </modal-dialog>
  </div>
</template>


<style lang="scss">

</style>
