<template>
  <div class="field">
    <v-stage ref="stage" id="stage-container" :config="stageConfig">
      <v-layer ref="layer">
        <v-rect @click="stageClick" :config="configBackground" ref="rect"/>
        <v-image @click="entityClick" :config="configImg" ref="img" />
        <v-text @click="entityClick" :config="configText" ref="text" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
export default {
  name: "Field",
  props: {
    fieldWidth: Number,
    fieldHeight: Number,
    imgUrl: String,
    text: String,
    gradient: Object,
  },
  data() {
    return {
      testImg: null,
      tr: new window.Konva.Transformer(),
    };
  },
  methods: {
    stageClick() {
      this.tr.setNodes([]);
      this.$refs.stage.getStage().draw();
    },
    entityClick(e) {
      this.tr.setNodes([e.target]);
      this.$refs.stage.getStage().draw();
    },
    fillImage(newUrl) {
      var errContainer = document.getElementsByClassName('settings__err-msg')[0];
      let vm = this;
      this.testImg = new Image();
      this.testImg.crossOrigin = "Anonymous";
      this.testImg.src = newUrl;
      this.testImg.onload = function () {
        vm.$refs.stage.getStage().draw();
        errContainer.style.display = 'none';
      };
      this.testImg.onerror = function () {
        errContainer.innerHTML = 'Invalid URL, or downloading of this image is prohibited by author of site (Blocked by CORS policy)';
        errContainer.style.display = 'block';
        vm.testImg = null;
        vm.tr.setNodes([]);
      }
      this.$nextTick(function () {
        this.$refs.img.getNode().setAttr("src", newUrl);
      });
    },
    setBackgroundRadialGradientSettings(backgroundConfig, points) {
      backgroundConfig.fillRadialGradientColorStops = points;
      backgroundConfig.fillRadialGradientStartRadius = 0;
      backgroundConfig.fillRadialGradientEndRadius = Math.min(
        this.fieldWidth / 2,
        this.fieldHeight / 2
      );
      backgroundConfig.fillRadialGradientStartPoint = {
        x: this.fieldWidth / 2,
        y: this.fieldHeight / 2,
      };
      backgroundConfig.fillRadialGradientEndPoint = {
        x: this.fieldWidth / 2,
        y: this.fieldHeight / 2,
      };
    },
    setBackgroundLinearGradientSettings(backgroundConfig, points) {
      let gradientRadius = Math.sqrt(
        Math.pow(this.fieldWidth / 2, 2) + Math.pow(this.fieldHeight / 2, 2)
      );
      let gradientAngleInRadians =
        (((this.gradient.degree + 270) % 360) * Math.PI) / 180;
      backgroundConfig.fillLinearGradientStartPoint = {
        x:
          -gradientRadius * Math.cos(gradientAngleInRadians) +
          this.fieldWidth / 2,
        y:
          -gradientRadius * Math.sin(gradientAngleInRadians) +
          this.fieldHeight / 2,
      };
      backgroundConfig.fillLinearGradientEndPoint = {
        x:
          gradientRadius * Math.cos(gradientAngleInRadians) +
          this.fieldWidth / 2,
        y:
          gradientRadius * Math.sin(gradientAngleInRadians) +
          this.fieldHeight / 2,
      };
      backgroundConfig.fillLinearGradientColorStops = points;
    },
  },
  computed: {
    configImg() {
      return {
        x: 20,
        y: 20,
        image: this.testImg,
        draggable: true,
      };
    },
    configBackground() {
      let backgroundConfig = {
        width: this.fieldWidth,
        height: this.fieldHeight,
        fillPriority: this.gradient.type + "-gradient",
      };
      let points = [];
      this.gradient.points.forEach((element) => {
        points.push(element.left / 100);
        points.push(
          `rgba(${element.red},${element.green},${element.blue},${element.alpha})`
        );
      });
      this.setBackgroundLinearGradientSettings(backgroundConfig, points);
      this.setBackgroundRadialGradientSettings(backgroundConfig, points);
      return backgroundConfig;
    },
    configText() {
      let croppedText = this.text.split("\n").slice(0, 3).join("\n");
      return {
        text: croppedText,
        draggable: true,
        fontSize: 20,
        scaleX: 1,
        scaleY: 1,
      };
    },
    stageConfig() {
      return {
        width: this.fieldWidth,
        height: this.fieldHeight,
      };
    },
  },
  watch: {
    imgUrl(newUrl) {
      if (newUrl == '') {
        var errContainer = document.getElementsByClassName('settings__err-msg')[0];
        errContainer.style.display = 'none';
      } 
      else 
        this.fillImage(newUrl);
    },
    gradient(newGradient) {
      this.$nextTick(function () {
        this.$refs.rect.getNode().setAttr("gradient", newGradient);
      });
    },
  },
  mounted() {
    this.$refs.layer.getStage().add(this.tr);
    this.tr.ignoreStroke(true);
    this.$refs.rect.getNode().setAttr("gradient", this.gradient);
  },
};
</script>

<style scoped>
.field {
  border: 1px solid gray;
  width: max-content;
}
</style>