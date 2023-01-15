/*
 * Project name
 * Project author
 * Jan 3, 2023
 *
 * This code uses--with thanks--bits and pieces of templates by gorillasun.de and wandaoliver.com,
 * especially for fxHash usage and size independence/high-rez output.
 */

import "p5"
// Use random functions from stdio and not from p5
import {random, randomGaussian, weight} from "@altesc/stdio"

console.log(fxhash)   // the 64 chars hex number fed to your algorithm

let seed // random seed

let buff // standard drawing buffer
let buffHr // high-resolution drawing buffer

const BUFF_SIZE = 1080 // effective buffer size

// control aspect ratio
let bufferWidthMod
let bufferHeightMod

let bufferWidth
let bufferHeight

const CANVAS_PIXEL_DENSITY = 1
const BUFF_PIXEL_DENSITY = 1

let scaleFactor

let wx
let wy

let backgroundColour

function preload()
{
  seed = int(random() * 999999)
}

const aspect = random("Aspect Ratio", [
  weight(40, "3:4"),
  weight(40, "4:3"),
  weight(20, "1:1"),
])

// FxHash features
window.$fxhashFeatures = {
  "Aspect Ratio": aspect,
}

window.setup = function () {

  computeWidthAndHeightMod(aspect)

  bufferWidth = BUFF_SIZE * bufferWidthMod
  bufferHeight = BUFF_SIZE * bufferHeightMod

  let w = min(windowWidth, windowHeight)

  wx = w * bufferWidthMod
  wy = w * bufferHeightMod

  createCanvas(wx, wy)
  pixelDensity(CANVAS_PIXEL_DENSITY)

  buff = createGraphics(bufferWidth, bufferHeight)
  buff.pixelDensity(BUFF_PIXEL_DENSITY)

  buffHr = createGraphics(bufferWidth, bufferHeight) // set density when saving

  scaleFactor = BUFF_SIZE/w

  setupBufferStuff()

  colorMode(HSB, 360, 100, 100, 100)
  backgroundColour = color(100)

  noLoop()
}

window.draw = function () {

  console.log(window.$fxhashFeatures)

  randomSeed(seed)
  noiseSeed(seed)

  drawToBuffer(buff)
  image(buff, 0, 0, wx, wy)

  fxpreview();
}

window.windowResized = function() {

  let w = min(windowWidth, windowHeight)

  wx = w * bufferWidthMod
  wy = w * bufferHeightMod

  scaleFactor = BUFF_SIZE/w

  resizeCanvas(wx, wy)
  image(buff, 0, 0, wx, wy)

}

// 1 key exports main buffer | 2 key exports 2x | 3 key exports 3x
window.keyPressed = function() {
  if (keyCode === 49) {
    drawToBuffer(buff)
    exportBuffer(buff)
  } else if (keyCode === 50) {
    buffHr.pixelDensity(2)
    drawToBuffer(buffHr)
    exportBuffer(buffHr)
  } else if (keyCode === 51) {
    buffHr.pixelDensity(3)
    drawToBuffer(buffHr)
    exportBuffer(buffHr)
  }
}

function setupBufferStuff() {
  buff.colorMode(HSB, 360, 100, 100, 100)
  buffHr.colorMode(HSB, 360, 100, 100, 100)
}

/* Everything you want to draw to the graphics buffer goes here */
function drawToBuffer(b) {
  b.background(backgroundColour)
  b.stroke(0)
  b.ellipse(bufferWidth/2, bufferHeight/2, BUFF_SIZE/4)

  b.ellipse(mouseX*scaleFactor, mouseY*scaleFactor, 10)
}
function computeWidthAndHeightMod(aspectString) {

  if (aspectString === "3:4") {
    bufferWidthMod = 1
    bufferHeightMod = 1.3
  }
  else if (aspectString === "4:3") {
    bufferWidthMod = 1.3
    bufferHeightMod = 1
  }
  else {
    bufferWidthMod  = 1
    bufferHeightMod = 1
  }
}

function exportBuffer(b) {
  save(b, 'img.png')
}
