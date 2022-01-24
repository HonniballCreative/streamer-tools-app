<script>
import { defineComponent } from 'vue';
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'ModalDialog',

  props: {
    type: {
      type: String,
      default: 'alert'
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },

    btnColor: {
      type: String,
      default: 'primary'
    },
    okText: {
      type: String,
      default: 'OK'
    },
    noText: {
      type: String,
      default: 'Cancel'
    },

    onClose: {
      type: Function,
      default: () => () => {}
    }
  },

  methods: {
    show(){ this.$dialog.show() },
    hide(){ this.$dialog.hide() },
    toggle(){ this.$dialog.toggle() },
  },

  mounted(){
    this.$dialog = new Modal(this.$refs['modal-dialog'], {
      keyboard: false
    })
  },

  unmounted(){
    this.$dialog.dispose();
  }
});
</script>


<template>
  <div class="modal fade" ref="modal-dialog" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header"><h5 class="modal-title">{{title}}</h5></slot>
        </div>
        <div class="modal-body">
          <slot name="body">{{message}}</slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <template v-if="type === 'alert'">
              <button type="button" :class="['btn', `btn-${btnColor}`]" data-bs-dismiss="modal">Ok</button>
            </template>
            <template v-if="type === 'confirm'">
              <button type="button" :class="['btn', `btn-${btnColor}`]" data-bs-dismiss="modal" @click="onClose(false)">{{ okText }}</button>
              <button type="button" :class="['btn', `btn-outline-${btnColor}`]" data-bs-dismiss="modal" @click="onClose(true)">{{ noText }}</button>
            </template>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
