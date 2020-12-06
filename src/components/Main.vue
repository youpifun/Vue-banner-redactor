<template>
  <div>
    <div class="background">
    </div>
    <div class="main">
      <div class="main__menu">
          <div class="navbar">
            <div v-on:click="curPage='sizeSettingsPage'"  
              class="navbar__button" v-bind:class="{ active: curPage=='sizeSettingsPage' }">
                Size settings
            </div>
            <div v-on:click="curPage='backgroundSettingsPage'"  
              class="navbar__button" v-bind:class="{ active: curPage=='backgroundSettingsPage' }">
                Background settings
            </div>
            <div v-on:click="curPage='otherSettingsPage'"
              class="navbar__button" v-bind:class="{ active: curPage=='otherSettingsPage' }">
                Other settings
            </div>
            <div v-on:click="curPage='exportPage'"  
              class="navbar__button" v-bind:class="{ active: curPage=='exportPage' }">
                Export
            </div>
            <div v-on:click="curPage='importPage'"
              class="navbar__button" v-bind:class="{ active: curPage=='importPage' }">
                Import
            </div>
          </div>
          <div class="settings">
              <div v-show="curPage=='sizeSettingsPage'" class="settings__page">
                <div class="size-settings-wrapper">
                  <p>Enter a banner's width:</p>
                  <input type="number" placeholder="width" v-model="form.width"/>
                  <p>Enter a banner's height:</p>
                  <input type="number" placeholder="height" v-model="form.height"/>
                </div>
              </div>
              <div v-show="curPage=='backgroundSettingsPage'" class="settings__page">
                <div class="background-settings-wrapper">
                  <div class="color-selector">
                    <div class="background-settings-info">
                      Выберите тип градиента:<br/>
                      <br/>
                      Выберите цвет:
                      <div class="background-settings-info__gradient-info">
                        Нажмите на слайдер, если хотите добавить градиент.
                      </div>
                    </div>
                    <ColorPicker
                      ref="picker"
                      v-if="curPage=='backgroundSettingsPage'"
                      :gradient="gradient"
                      :isGradient="true"
                      :onStartChange="gradient => onChange(gradient, 'start')"
                      :onChange="gradient => onChange(gradient, 'change')"
                      :onEndChange="gradient => onChange(gradient, 'end')"
                    />
                  </div>
                </div>
              </div>
              <div v-show="curPage=='otherSettingsPage'" class="settings__page">
                <input type="text" placeholder="URL of image" v-model="form.imgUrl"/>
                <textarea placeholder="Enter a text" v-model="form.text"/>
              </div>
              <div v-show="curPage=='exportPage'" class="settings__page">
                <button v-on:click="exportPNG">Export as PNG</button>
                <button v-on:click="exportHTML">Export as HTML</button>
                <button v-on:click="exportJSON">Export as JSON</button>
              </div>
              <div v-show="curPage=='importPage'" class="settings__page">
                <textarea rows="15" id="importText"></textarea>
                <button @click="importFromJson">Import</button>
              </div>
          </div>
      </div>
      <div class="banner-preview">
        <Field :fieldWidth="Number(form.width)" :fieldHeight="Number(form.height)" :imgUrl="this.form.imgUrl" :gradient="this.gradient" :text="form.text" ref="field"/>
      </div>
    </div>
    <div class="shadow-banner">
      <img class="shadow-banner__image" src="" alt=""/>
      <span class="shadow-banner__text"></span>
    </div>
  </div>
</template>

<script>

import Field from './Field.vue';
import {ColorPicker} from 'vue-color-gradient-picker';
export default {
  name: 'Main',
  components: {
    Field,
    ColorPicker
  },
  data() {
      return {
        form: {
          width: 500,
          height: 500,
          imgUrl: '',
          text: ''
        },
        gradient: {
          type: 'linear',
          degree: 315,
          points: [
            {
              left: 0,
              red: 200,
              green: 200,
              blue: 200,
              alpha: 1
            },
            {
              left: 100,
              red: 200,
              green: 200,
              blue: 200,
              alpha: 1
            }
          ]      
        },
        curPage: 'sizeSettingsPage',
      }
  },
  methods: {
      onChange(attrs) {
        this.gradient = { ...attrs };
      },
      downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
      },
      exportPNG() {
        let stage = this.$refs.field.$refs.stage.getStage();
        stage.find('Transformer').destroy();
        var dataURL = stage.toDataURL({ pixelRatio: 1 });
        this.downloadURI(dataURL, 'banner.png');
      },
      exportJSON() {
        console.log(this.$refs.field.$refs.stage.getNode().toJSON());
      },
      exportHTML() {
        this.setShadowBannerStyles();
        if (this.$refs.field.$refs.text != undefined)
        this.setShadowBannerTextStyles();
        if (this.$refs.field.$refs.img != undefined)
        this.setShadowBannerImageStyles();
      },
      setShadowBannerStyles() {
        var shadowBanner = document.getElementsByClassName('shadow-banner')[0];
        shadowBanner.style.outline = "1px solid black";
        shadowBanner.style.position = "relative";
        shadowBanner.style.width = this.form.width + 'px';
        shadowBanner.style.height = this.form.height + 'px';
        shadowBanner.style.background = this.gradient.style;
        shadowBanner.style.overflow = 'hidden';
      },
      setShadowBannerTextStyles() {
        var konvaAttrs = this.$refs.field.$refs.text.getNode().getAttrs();
        var shadowText = document.getElementsByClassName('shadow-banner__text')[0];
        shadowText.style.position = "absolute";
        shadowText.style.fontFamily = "Arial";
        shadowText.style.whiteSpace = "pre-wrap";
        shadowText.style.fontSize = "20px";
        shadowText.style.width = "max-content";
        shadowText.style.height = "max-content";
        shadowText.style.left = konvaAttrs.x + 'px';
        shadowText.style.top = konvaAttrs.y + 'px';
        shadowText.style.lineHeight = 0.9;
        shadowText.style.transformOrigin = 'left top 0';
        shadowText.style.transform = `rotate(${konvaAttrs.rotation}deg) scale(${konvaAttrs.scaleX}, ${konvaAttrs.scaleY})`;
        shadowText.innerHTML = konvaAttrs.text;
      },
      setShadowBannerImageStyles() {
        var konvaAttrs = this.$refs.field.$refs.img.getNode().getAttrs();
        var shadowImage = document.getElementsByClassName('shadow-banner__image')[0];
        shadowImage.style.position = "absolute";
        shadowImage.style.left = konvaAttrs.x + 'px';
        shadowImage.style.top = konvaAttrs.y + 'px';
        shadowImage.style.transformOrigin = 'left top 0px'; 
        shadowImage.style.transform = `rotate(${konvaAttrs.rotation}deg) scale(${konvaAttrs.scaleX}, ${konvaAttrs.scaleY})`;
        shadowImage.src = this.form.imgUrl;
      },
      importFromJson() {
        let fieldRefs = this.$refs.field.$refs;
        let stageObject = JSON.parse(document.getElementById('importText').value);
        stageObject.children[0].children.forEach(element => {
          if (element.className=='Image')
            fieldRefs.img.getNode().setAttrs(element.attrs);
          else if (element.className=='Text')
            fieldRefs.text.getNode().setAttrs(element.attrs);
          else if (element.className=='Stage')
            fieldRefs.stage.getNode().setAttrs(element.attrs);
          else if (element.className=='Rect')
            fieldRefs.rect.getNode().setAttrs(element.attrs);
        });
        this.form.width = fieldRefs.rect.getNode().getAttr('width');
        this.form.height = fieldRefs.rect.getNode().getAttr('height');
        this.form.text = fieldRefs.text.getNode().getAttr('text');
        this.gradient = fieldRefs.rect.getNode().getAttr('gradient');
        this.form.imgUrl = fieldRefs.img.getNode().getAttr('src');
      }
  }
};
</script>

<style scoped>
  
  .main {
    display: flex;
  }

  .main__menu {
    width: 660px;
  }

  .banner-preview {
    margin-left: 15%;
  }

  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -9999;
    background: bisque;
  }

  .navbar {
    display: flex;
    justify-content: flex-start;
  }

  .navbar__button {
    display: flex;
    justify-content: center;
    border-radius: 5px;
    padding: 10px;
    color: rgb(39, 38, 38);
    cursor: pointer;
    background: linear-gradient(to bottom,rgba(35,193,185,1) 0,rgba(12,156,152,1) 100%);
    color: black;
    margin-right: 5px;
    font-size: 22px;
    color: whitesmoke;
  }
  
  .active {
      background: linear-gradient(to bottom,rgba(208,12,96,1) 0,rgba(154,29,69,1) 100%); 
  }

  .gradient-block {
    margin: 2% 0;
  }

  .settings__page {
    height: 500px;
    border: 1px solid black;
  }

  input {
    padding: 10px;
    border-radius: 5px;
    font-size: 20px;
  }
  
  .settings__page:first-child {
    display: flex;
    flex-direction: column;
    font-size: 20px;
  }

  .settings__page:first-child>input {
    width: 50%;
  }

  .size-settings-wrapper {
    margin-top: 30px;
    align-self: center;
  }

  .color-selector {
    display: flex;
    justify-content: center;
    margin-top: 50px;
    border-radius: 5px;
    margin: 10% 0%;
  }

  .background-settings-info {
    width: 40%;
  }

  .background-settings-info__gradient-info {
    margin-top: 48%;
  }
</style>
<style src="vue-color-gradient-picker/dist/index.css" lang="css" />
 <style>
    .gradient, .preview-box {
      background: lightgray;
    }

    .ui-color-picker {
      background: inherit;
    }
 </style>