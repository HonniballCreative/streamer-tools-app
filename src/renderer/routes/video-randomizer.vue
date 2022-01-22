<script>
import { defineComponent } from 'vue'
import { ipcRenderer } from '@/electron'
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'VideoRandomizer',

  data() {
    return {
      formData: {
        randomize: 'yes',
        all: 'yes',
        loop: 'yes',
        preventRepeat: 'yes',
        files: [],
      },

      modalLink: '',
    }
  },

  methods: {
    submitFormData(){
      const convertedFormData = JSON.parse(JSON.stringify(this.formData))
      const promise = ipcRenderer.invoke('form-submit', convertedFormData)

      promise.then((result) => {
        console.log(
          '%cTEST ->\n\tresult[%s]: %O',
          'font-size: 14px; color: #DC143C;',
          typeof result,
          result
        )
        this.modalLink = result.savePath

        this.dialog.show();
      })
    },

    filesSelected(e){
      let files = e.target.files;

      for(let i = 0; i < files.length; i++) {
        this.formData.files.push(files[i].path);
      };

      e.target.value = '';
    },
  },

  mounted(){
    this.dialog = new Modal(this.$refs['modal'], {
      keyboard: false
    })
  },

  unmounted(){
    this.dialog.dispose();
  }
});
</script>


<template>
  <div class="component-container">
    <p>Welcome to the Streamerific Video Randomizer! This tool allows you to have a randomly selected video play when you <em>switch to a scene</em> or <em>hide/show the controlling browser source</em> in OBS Studio. Using the options below you can customize the behavior of the randomizer to suit your needs.</p>

    <p>If you have any questions or have trouble getting it to work please contact <a href="https://twitter.com/StreamerEdu" target="_blank">@StreamerEdu</a> on Twitter.</p>

    <hr class="my-3">

    <form id="form">
      <h2>Options</h2>

      <p class="text-danger">Setting <em>play all videos</em> and/or <em>Loop once complete</em> options to "yes" will require you to either <em>hide the source</em> or <em>switch to another scene</em> to halt video playback.</p>

      <div class="mb-3">
        <label class="form-label">Randomize Videos?</label>
        <div class="mb-4">
          <input type="radio" class="btn-check" name="randomize" autocomplete="off" value="yes" id="randomize-yes" v-model="formData.randomize">
          <label class="btn btn-outline-primary mx-1" for="randomize-yes">Yes</label>

          <input type="radio" class="btn-check" name="randomize" autocomplete="off" value="no" id="randomize-no" v-model="formData.randomize">
          <label class="btn btn-outline-danger mx-1" for="randomize-no">No</label>

          <div class="form-text">
            This option will randomize all videos provided.
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Play all videos?</label>
        <div class="mb-4">
          <input type="radio" class="btn-check" name="all" autocomplete="off" value="yes" id="all-yes" v-model="formData.all">
          <label class="btn btn-outline-primary mx-1" for="all-yes">Yes</label>

          <input type="radio" class="btn-check" name="all" autocomplete="off" value="no" id="all-no" v-model="formData.all">
          <label class="btn btn-outline-danger mx-1" for="all-no">No</label>

          <div class="form-text">
            This option will play through all videos provided.
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Loop once complete?</label>
        <div class="mb-4">
          <input type="radio" class="btn-check" name="loop" autocomplete="off" value="yes" id="loop-yes" v-model="formData.loop">
          <label class="btn btn-outline-primary mx-1" for="loop-yes">Yes</label>

          <input type="radio" class="btn-check" name="loop" autocomplete="off" value="no" id="loop-no" v-model="formData.loop">
          <label class="btn btn-outline-danger mx-1" for="loop-no">No</label>

          <div class="form-text">
            This option will loop through the video(s) after playback completes.
            <ul>
              <li>If you have "all" set to "yes" then playback will start over and loop through the collection again.</li>
              <li>If you set "all" to "no" then a single video will loop forever.</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Prevent repeats?</label>
        <div class="mb-4">
          <input type="radio" class="btn-check" name="preventRepeat" autocomplete="off" value="yes" id="preventRepeat-yes" v-model="formData.preventRepeat">
          <label class="btn btn-outline-primary mx-1" for="preventRepeat-yes">Yes</label>

          <input type="radio" class="btn-check" name="preventRepeat" autocomplete="off" value="no" id="preventRepeat-no" v-model="formData.preventRepeat">
          <label class="btn btn-outline-danger mx-1" for="preventRepeat-no">No</label>

          <div class="form-text">
            This option will attempt to prevent videos from repeating when the source is hidden then shown again. <em>Please note: this uses the browser source <code>localStorage</code> and therefor may not work.</em>
          </div>
        </div>
      </div>

      <hr class="my-3">

      <h3>Video Files</h3>

      <div class="input-group">
        <input type="file" class="form-control" ref="filepicker" accept="video/*" multiple @change="filesSelected"/>
        <button class="btn btn-outline-secondary" type="button" @click="formData.files = []">Clear</button>
      </div>

      <ul class="list-group mt-3" id="listing">
        <li class="list-group-item" v-for="filePath in formData.files" :key="filePath">
          {{filePath}}
        </li>
      </ul>

      <div style="height: 100px;"></div>

      <nav class="navbar fixed-bottom navbar-light bg-light">
        <div class="container-fluid justify-content-end">
          <button type="button" class="btn btn-primary rounded-pill" @click="submitFormData">Submit</button>
        </div>
      </nav>
    </form>


    <div class="modal" ref="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Your randomizer has been saved!</h5>
          </div>
          <div class="modal-body">
            <p><strong>Your Browser Source URL:</strong></p>
            <p class="font-monospace text-danger">file:///{{modalLink.replace(/\\{1,2}/g, '/')}}</p>
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
