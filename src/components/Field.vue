<template>
    <div class='field'>
        <v-stage ref='stage' id='stage-container' :config="stageConfig">
            <v-layer ref='layer'>
                <v-rect @click="stageClick" :config="configBackground" ref="rect">
                </v-rect>
                <v-image @click="imgClick" :config="configImg" ref='img'/>
                <v-text :config="configText" @click="imgClick" ref='text'/>
            </v-layer>
        </v-stage>
    </div>
</template>

<script>
export default {
    name: 'Field',
    props: {
        fieldWidth: Number,
        fieldHeight: Number,
        imgUrl: String,
        text: String,
        gradient: Object
    },
    data() {
        return {
            testImg: null,
            tr: new window.Konva.Transformer()
        }
    },
    methods: {
            stageClick () {
                let stage = this.$refs.stage.getStage();
                this.tr.setNodes([]);
                stage.draw();
            },
            imgClick (e) {
                let stage = this.$refs.stage.getStage();
                this.tr.setNodes([e.target]);
                //layer.add(tr);
                stage.draw();
            },
            fillImage(newUrl) {
                var vm = this;
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = newUrl;
                this.testImg = img;
                this.testImg.onload = function () {
                    let stage = vm.$refs.stage.getStage();
                    stage.draw();
                }
                this.$nextTick(function () {
                    this.$refs.img.getNode().setAttr('src', newUrl)
                })
            }
    },
    computed: { 
        configImg: function() {
            return {
                x: 20,
                y: 20,
                image: this.testImg,
                draggable: true
            }
        },
        configBackground: function() {
            var backgroundConfig = {
                width: this.fieldWidth,
                height: this.fieldHeight,
                fillPriority: this.gradient.type+'-gradient'
            };
            var points = [];
            var gradientRadius = Math.sqrt(Math.pow(this.fieldWidth/2, 2)+Math.pow(this.fieldHeight/2, 2));
            var gradientAngleInRadians = (this.gradient.degree+270)%360*Math.PI/180;
            this.gradient.points.forEach(element => {
                points.push(element.left/100);
                points.push(`rgba(${element.red},${element.green},${element.blue},${element.alpha})`);
            });
            backgroundConfig.fillRadialGradientStartPoint = {x:this.fieldWidth/2,y:this.fieldHeight/2};
            backgroundConfig.fillRadialGradientEndPoint = {x:this.fieldWidth/2,y:this.fieldHeight/2};
            backgroundConfig.fillLinearGradientStartPoint = {
                    x: -gradientRadius*Math.cos(gradientAngleInRadians) + this.fieldWidth / 2,
                    y: -gradientRadius*Math.sin(gradientAngleInRadians) + this.fieldHeight / 2
                };
            backgroundConfig.fillLinearGradientEndPoint = {
                    x: gradientRadius*Math.cos(gradientAngleInRadians) + this.fieldWidth / 2,
                    y: gradientRadius*Math.sin(gradientAngleInRadians) + this.fieldHeight / 2
                };
            if (this.gradient.type == 'radial') {
                backgroundConfig.fillRadialGradientColorStops = points;
                backgroundConfig.fillRadialGradientStartRadius = 0;
                backgroundConfig.fillRadialGradientEndRadius = Math.min(this.fieldWidth/2, this.fieldHeight/2);
            } else {
                backgroundConfig.fillLinearGradientColorStops = points;
            }
            return backgroundConfig;
        },
        configText: function() {
            var croppedText = this.text.split('\n').slice(0, 3).join('\n');
            return {
                text: croppedText,
                draggable: true,
                fontSize: 20,
                scaleX: 1,
                scaleY: 1
            }
        },
        stageConfig: function() {
            return {
                width: this.fieldWidth,
                height: this.fieldHeight
            }
        }
    },
    watch: {
        imgUrl(newUrl) {
           this.fillImage(newUrl);
        },

        gradient(newGradient) {
            this.$nextTick(function () {
                this.$refs.rect.getNode().setAttr('gradient', newGradient);
            });
        }
    },
    mounted() {
        this.$refs.layer.getStage().add(this.tr);
        this.tr.ignoreStroke(true);
    }
}
</script>

<style scoped>
    .field {
        border: 1px solid gray;
        width: max-content;
    }
</style>