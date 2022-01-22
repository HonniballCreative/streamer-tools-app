<script>
import { defineComponent } from 'vue'
import { ipcRenderer, loadPreferences } from '@/electron'
import { Modal } from 'bootstrap'

import { copyText } from 'vue3-clipboard'

export default defineComponent({
  name: 'VideoRandomizerIndex',

  data() {
    const prefs = loadPreferences('video-randomizer')

    return {
      loadingPrefs: false,
      files: prefs.files,
      fileToDelete: null,
    }
  },

  methods: {
    refreshPrefs(e){
      if(this.loadingPrefs) return
      this.loadingPrefs = true
      setTimeout(() => {
        const prefs = loadPreferences('video-randomizer')
        this.files = prefs.files
        this.loadingPrefs = false
      }, 2000)
    },
    copyText(e, text){
      copyText(text, undefined, (error, event) => {
        let standardClasses = [
          'fa-copy',
          'text-primary'
        ];
        let tempClasses = [
          'fa-check',
          'text-success',
          'animate__animated',
          'animate__rubberBand'
        ];

        if(error){
          tempClasses = [
            'fa-exclamation-triangle',
            'text-danger',
            'animate__animated',
            'animate__rubberBand'
          ];
        }

        e.target.classList.remove(...standardClasses)
        e.target.classList.add(...tempClasses)
        setTimeout(() => {
          e.target.classList.remove(...tempClasses)
          e.target.classList.add(...standardClasses)
        }, 1000)
      })
    },

    deleteRandomizer(){
      const promise = ipcRenderer.invoke('delete-randomizer-file', this.fileToDelete)
      promise.then((result) => {
        const prefs = loadPreferences('video-randomizer')
        this.files = prefs.files
        this.fileToDelete = null
      })
    },
  },

  mounted(){
    this.deleteDialog = new Modal(this.$refs['deleteDialog'], {
      keyboard: false
    })
  },

  unmounted(){
    this.deleteDialog.dispose();
  }
});
</script>1

<template>
  <div class="component-container">
    <h1>Video Randomizer Tool</h1>
    <p class="lead fw-normal">This tool allows you to create browser source compatible HTML that will play a random video from a list of video files on your computer.</p>

    <h6>If you have any questions or have trouble getting it to work please contact <a href="https://twitter.com/StreamerEdu" target="_blank">@StreamerEdu</a> on Twitter.</h6>

    <hr class="my-3">

    <div class="grid">
      <div class="g-col-6 d-flex align-items-stretch">
        <div class="card w-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">Create a New Randomizer</h5>
            <p class="card-text">Setup options and select videos for a new video randomizer. Then paste the URL into a browser source in OBS Studio.</p>
            <div class="mt-auto">
              <router-link :to="{ name: 'VideoRandomizerCreate' }" class="btn btn-success"><i class="me-2 fas fa-plus"></i>Create</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="g-col-6 d-flex align-items-stretch">
        <div class="card w-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">View the Video Tutorial</h5>
            <p class="card-text">I've created an in-depth tutorial on usage of this tool. It's available on the Streamer Education YouTube channel!</p>
            <div class="mt-auto">
              <a href="https://www.youtube.com/channel/UCif1IkNaiXd2xe0G_tz1F2w" class="btn btn-danger" target="_blank"><i class="me-2 fas fa-external-link"></i>Watch on YouTube</a>
              <span class="p-3 text-muted"><small>Pssst... don't forget to <i class="fas fa-thumbs-up"></i> and subscribe!<i class="ms-2 far fa-smile-wink"></i></small></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-3">

    <ul class="list-group mt-3" id="listing" v-if="files.length > 0">
      <li class="list-group-item" v-for="file in files" :key="file.path">
        <span v-if="file.valid === true">
          <i class="d-none fas fa-pencil text-success cursor-pointer p-2"
            data-bs-toggle="modal" data-bs-target="#coming-soon"
          ></i>
          <i class="fas fa-trash text-danger cursor-pointer p-2"
            data-bs-toggle="modal" data-bs-target="#delete-confirmation"
            @click="fileToDelete = file.path"
          ></i>
          <i class="fas fa-copy fa-fw text-primary cursor-pointer ms-auto p-2"
            @click="copyText($event, `file:///${file.path.replace(/\\{1,2}/g, '/')}`)"
          ></i>
        </span>
        <span v-else>
          <span
            class="text-danger cursor-pointer"
            data-bs-toggle="modal" data-bs-target="#not-found"
            @click="fileToDelete = file.path"
          >
            Not Found!
          </span>
          <i
            :class="[
              'fas fa-sync fa-fw text-primary cursor-pointer',
              (loadingPrefs) ? 'fa-spin' : ''
            ]"
            @click="refreshPrefs"
          ></i>
        </span>

        <span class="p-1 ps-3">{{`file:///${file.path.replace(/\\{1,2}/g, '/')}`}}</span>
      </li>
    </ul>
    <div class="card text-dark bg-info bg-opacity-10" v-else>
      <div class="card-body text-center">
        <h5 class="card-title">No Randomizers!</h5>
        <p class="card-text">You have not created any randomizers!</p>
      </div>
    </div>

    <div class="modal fade" id="coming-soon" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Coming Soon!</h5>
          </div>
          <div class="modal-body">
            <p>This feature is not available yet.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="not-found" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Unable to Locate File</h5>
          </div>
          <div class="modal-body">
            <p>We were unable to locate the file for this randomizer.</p>
            <p>To restore management within the Streamerific Tool App please move the file back to it's saved location then "Refresh File List".</p>
            <p>Otherwise, you can delete the randomizer within the App.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger me-auto" data-bs-dismiss="modal" @click="deleteRandomizer()">Delete</button>
            <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal" @click="refreshPrefs">Refresh File List</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Ok</button>
          </div>
        </div>
      </div>
    </div>

    <div ref="deleteDialog" class="modal fade" id="delete-confirmation" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Are you sure you want to delete this randomizer?</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this randomizer?</p>
            <p class="font-monospace text-primary">{{fileToDelete}}</p>
            <p class="text-danger fw-bold">This action is non-reversible!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="fileToDelete = null">Close</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteRandomizer()">Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">

</style>
