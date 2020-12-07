<template>
  <div>
    <div class="background"></div>
    <div class="main">
      <div class="main__menu">
        <div class="navbar">
          <div
            v-on:click="curPage = 'sizeSettingsPage'"
            class="navbar__button"
            v-bind:class="{ active: curPage == 'sizeSettingsPage' }"
          >
            Size settings
          </div>
          <div
            v-on:click="curPage = 'backgroundSettingsPage'"
            class="navbar__button"
            v-bind:class="{ active: curPage == 'backgroundSettingsPage' }"
          >
            Background settings
          </div>
          <div
            v-on:click="curPage = 'otherSettingsPage'"
            class="navbar__button"
            v-bind:class="{ active: curPage == 'otherSettingsPage' }"
          >
            Other settings
          </div>
          <div
            v-on:click="curPage = 'exportPage'"
            class="navbar__button"
            v-bind:class="{ active: curPage == 'exportPage' }"
          >
            Export
          </div>
          <div
            v-on:click="curPage = 'importPage'"
            class="navbar__button"
            v-bind:class="{ active: curPage == 'importPage' }"
          >
            Import
          </div>
        </div>
        <div class="settings">
          <div v-show="curPage == 'sizeSettingsPage'" class="settings__page">
            <div class="size-settings-wrapper">
              <p>Enter a banner's width:</p>
              <input type="number" placeholder="width" v-model="form.width" />
              <p>Enter a banner's height:</p>
              <input type="number" placeholder="height" v-model="form.height" />
            </div>
          </div>
          <div
            v-show="curPage == 'backgroundSettingsPage'"
            class="settings__page"
          >
            <div class="background-settings-wrapper">
              <div class="color-selector">
                <div class="background-settings-info">
                  Выберите тип градиента:<br />
                  <br />
                  Выберите цвет:
                  <div class="background-settings-info__gradient-info">
                    Нажмите на слайдер, если хотите добавить градиент.
                  </div>
                </div>
                <ColorPicker
                  ref="picker"
                  v-if="curPage == 'backgroundSettingsPage'"
                  :gradient="gradient"
                  :isGradient="true"
                  :onStartChange="(gradient) => onGradientChange(gradient, 'start')"
                  :onChange="(gradient) => onGradientChange(gradient, 'change')"
                  :onEndChange="(gradient) => onGradientChange(gradient, 'end')"
                />
              </div>
            </div>
          </div>
          <div v-show="curPage == 'otherSettingsPage'" class="settings__page">
            <div class="other-settings-container">
              <div class="other-settings-container__input-wrapper">
                <div class="other-settings-container__url-container">
                  Вставьте ссылку для баннера:
                  <input type="text" 
                    placeholder="Переход на ссылку, при клике" 
                    v-model="form.redirectUrl" 
                    class="other-settings-container__input"
                  />
                </div>
                <div class="other-settings-container__url-container">
                  Вставьте URL или Base64: 
                  <input
                    type="text"
                    placeholder="URL of image"
                    v-model="form.imgUrl"
                    class="other-settings-container__input"
                  />
                </div>
              </div>
              <div class="settings__err-msg">
                
              </div> 
              <textarea rows="8" class="other-settings-container__text-input" placeholder="Enter a text" v-model="form.text" />
            </div>
          </div>
          <div v-show="curPage == 'exportPage'" class="settings__page">
            <div class="buttons-container">
              <button class="buttons-container__btn" v-on:click="exportPNG">Export as PNG</button>
              <button class="buttons-container__btn" v-on:click="exportHTML">Export as HTML</button>
              <button class="buttons-container__btn" v-on:click="exportJSON">Export as JSON</button>
            </div>
            <textarea rows="8" class="settings__export-text" readonly></textarea>
          </div>
          <div v-show="curPage == 'importPage'" class="settings__page">
            <div class="import-text">
              <textarea rows="15" placeholder="Вставьте сюда экспортированный баннер в формате JSON" id="importText"></textarea>
              <button class="buttons-container__btn import-text__btn" @click="importFromJson">Import</button>
            </div>
          </div>
        </div>
      </div>
      <div class="banner-preview">
        <Field
          :fieldWidth="Number(form.width)"
          :fieldHeight="Number(form.height)"
          :imgUrl="this.form.imgUrl"
          :gradient="this.gradient"
          :text="form.text"
          ref="field"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Field from "./Field.vue";
import { ColorPicker } from "vue-color-gradient-picker";
export default {
  name: "Main",
  components: {
    Field,
    ColorPicker,
  },
  data() {
    return {
      form: {
        width: 500,
        height: 500,
        imgUrl: "",
        text: "",
        redirectUrl: ''
      },
      gradient: {
        type: "linear",
        degree: 315,
        points: [
          {
            left: 0,
            red: 200,
            green: 200,
            blue: 200,
            alpha: 1,
          },
          {
            left: 100,
            red: 200,
            green: 200,
            blue: 200,
            alpha: 1,
          },
        ],
      },
      curPage: "sizeSettingsPage",
    };
  },
  methods: {
    onGradientChange(attrs) {
      this.gradient = { ...attrs };
    },
    downloadURI(uri, name) {
      let link = document.createElement("a");
      link.download = name;
      link.href = uri;
      link.click();
    },
    exportPNG() {
      let stage = this.$refs.field.$refs.stage;
      this.$refs.field.stageClick();
      let dataURL = stage.getStage().toDataURL({ pixelRatio: 1 });
      this.downloadURI(dataURL, "banner.png");
    },
    exportJSON() {
      let exportTxtBlock = document.getElementsByClassName('settings__export-text')[0];
      exportTxtBlock.innerHTML = "";
      exportTxtBlock.innerHTML = this.$refs.field.$refs.stage.getNode().toJSON();
    },
    exportHTML() {
      let shadowBanner = this.createBanner();
      this.setShadowBannerStyles(shadowBanner);
      if (this.$refs.field.$refs.img != undefined) {
        let shadowImage = this.createImage(shadowBanner);
        this.setShadowBannerImageStyles(shadowImage);
      }
      if (this.$refs.field.$refs.text != undefined) {
        let shadowText = this.createText(shadowBanner);
        this.setShadowBannerTextStyles(shadowText);
      }
      let exportTxtBlock = document.getElementsByClassName('settings__export-text')[0];
      exportTxtBlock.innerHTML = "";
      if (this.form.redirectUrl != ''){
        let createdRefirectLink = document.createElement('a');
        createdRefirectLink.href = this.form.redirectUrl;
        createdRefirectLink.appendChild(shadowBanner);
        createdRefirectLink.style.textDecoration = 'none';
        exportTxtBlock.innerHTML = createdRefirectLink.outerHTML;
      } else 
        exportTxtBlock.innerHTML = shadowBanner.outerHTML;
    },
    createBanner() {
      let createdBanner = document.createElement('div');
      createdBanner.classList.add('shadow-banner');
      return createdBanner;
    },
    createImage(createdBanner) {
      let createdImage = document.createElement('img');
      createdImage.classList.add('shadow-banner__image');
      createdBanner.appendChild(createdImage);
      return createdImage;
    },
    createText(createdBanner) {
      let createdText = document.createElement('span');
      createdText.classList.add('shadow-banner__text');
      createdBanner.appendChild(createdText);
      return createdText;
    },
    setShadowBannerStyles(shadowBanner) {
      shadowBanner.style.outline = "1px solid black";
      shadowBanner.style.position = "relative";
      shadowBanner.style.width = this.form.width + "px";
      shadowBanner.style.height = this.form.height + "px";
      shadowBanner.style.background = this.gradient.style;
      shadowBanner.style.overflow = "hidden";
    },
    setShadowBannerTextStyles(shadowText) {
      let konvaAttrs = this.$refs.field.$refs.text.getNode().getAttrs();
      shadowText.style.position = "absolute";
      shadowText.style.fontFamily = "Arial";
      shadowText.style.whiteSpace = "pre-wrap";
      shadowText.style.fontSize = "20px";
      shadowText.style.width = "max-content";
      shadowText.style.height = "max-content";
      shadowText.style.left = konvaAttrs.x + "px";
      shadowText.style.top = konvaAttrs.y + "px";
      shadowText.style.lineHeight = 0.9;
      shadowText.style.transformOrigin = "left top 0";
      shadowText.style.transform = `rotate(${konvaAttrs.rotation}deg) scale(${konvaAttrs.scaleX}, ${konvaAttrs.scaleY})`;
      shadowText.innerHTML = konvaAttrs.text;
    },
    setShadowBannerImageStyles(shadowImage) {
      let konvaAttrs = this.$refs.field.$refs.img.getNode().getAttrs();
      shadowImage.style.position = "absolute";
      shadowImage.style.left = konvaAttrs.x + "px";
      shadowImage.style.top = konvaAttrs.y + "px";
      shadowImage.style.transformOrigin = "left top 0px";
      shadowImage.style.transform = `rotate(${konvaAttrs.rotation}deg) scale(${konvaAttrs.scaleX}, ${konvaAttrs.scaleY})`;
      shadowImage.src = this.form.imgUrl;
    },
    setInputsAfterImport(fieldRefs) {
      this.form.width = fieldRefs.rect.getNode().getAttr("width");
      this.form.height = fieldRefs.rect.getNode().getAttr("height");
      this.form.text = fieldRefs.text.getNode().getAttr("text");
      this.gradient = fieldRefs.rect.getNode().getAttr("gradient");
      if (fieldRefs.img.getNode().getAttr("src") != undefined)
        this.form.imgUrl = fieldRefs.img.getNode().getAttr("src");
    },
    importFromJson() {
      let fieldRefs = this.$refs.field.$refs;
      let stageObject = JSON.parse(document.getElementById("importText").value);
      stageObject.children[0].children.forEach((element) => {
        if (element.className == "Image")
          fieldRefs.img.getNode().setAttrs(element.attrs);
        else if (element.className == "Text")
          fieldRefs.text.getNode().setAttrs(element.attrs);
        else if (element.className == "Stage")
          fieldRefs.stage.getNode().setAttrs(element.attrs);
        else if (element.className == "Rect")
          fieldRefs.rect.getNode().setAttrs(element.attrs);
      });
      this.setInputsAfterImport(fieldRefs);
    },
  },
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
  justify-content: space-between;
}

.navbar__button {
  display: flex;
  justify-content: center;
  border-radius: 5px;
  padding: 10px;
  color: rgb(39, 38, 38);
  cursor: pointer;
  background: linear-gradient(
    to bottom,
    rgba(35, 193, 185, 1) 0,
    rgba(12, 156, 152, 1) 100%
  );
  color: black;
  margin-right: 5px;
  font-size: 22px;
  color: whitesmoke;
}

.navbar__button:last-child {
  margin-right: 0;
}

.active {
  background: linear-gradient(
    to bottom,
    rgba(208, 12, 96, 1) 0,
    rgba(154, 29, 69, 1) 100%
  );
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

.settings__page:first-child > input {
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

.background-settings-info {
  margin-top: 2%;
}

.buttons-container__btn {
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  background: cadetblue;
  color: whitesmoke;
  font-size: 16px;
  width: 30%;
}

.buttons-container__btn:hover {
  background: turquoise;
}

.other-settings-container {
  display: flex;
  flex-direction: column;
}

.other-settings-container__input {
  width: fit-content;
  height: auto;
  margin-left: auto;
}

.other-settings-container__input-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: 5%;
}

.other-settings-container__text-input {
  font-size: 16px;
  margin-top: 7%;
  max-width: 100%;
  min-width: 100%;
}

.settings__err-msg {
  color: red;
  margin: -2% 3% -4% 3%;
  display: none;
}

.buttons-container {
  margin-top: 6%;
  display: flex;
  justify-content: space-around;
}

.settings__export-text {
  margin-top: 6%;
  min-width: 100%;
  max-width: 100%;
  height: 60%;
}

.import-text {
  display: flex;
  flex-direction: column;
  min-width: 100%;
  max-width: 100%;
}

.import-text__btn {
  margin: 5% auto;
}

.other-settings-container__url-container {
  display: flex;
  width: 100%;
  align-items: center;
}

.other-settings-container__url-container:first-child {
  margin-bottom: 2%;
}
</style>

<style src="vue-color-gradient-picker/dist/index.css" lang="css" />
 <style>
.gradient,
.preview-box {
  background: lightgray;
}

.ui-color-picker {
  background: inherit;
}
</style>