const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const tf = require("@tensorflow/tfjs-node");

const IMAGESIZE = 28;
const MIME_TYPES = ['image/jpg','image/jpeg','image/png']
min = function(num1, num2) {
  return num1 > num2 ? num2 : num1;
};
argMax = function(array) {
  let max = -Infinity;
  let pos = -1;
  for (let i = 0; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i];
      pos = i;
    }
  }
  return { predicted: pos, score: max };
};
let upload = multer().single("image")
router.use("/classify", async (req, res) => {
  upload(req, res, async (err)=>{
    if(err){
      return res.json({
        sucess: false,
        message: 'No file was provided'
      })  
    }else{
      if(!req.file){
        return res.json({
          sucess: false,
          message: 'No file was provided'
        })
      }
      mimeTypeIndex = MIME_TYPES.indexOf(req.file.mimetype)
      if(mimeTypeIndex == -1){
        return res.json({
          sucess: false,
          message: 'File type is invalid'
        })
      }
      const model = await tf.loadLayersModel(
        `file://cnn//models/converted-model/model.json`
      );
      
      decodedImage = tf.node.decodeImage(req.file.buffer);
      const grayScaled = tf.tidy(() => {
        resized = tf.image.resizeBilinear(decodedImage, [IMAGESIZE, IMAGESIZE]);
        unstacked = tf.unstack(resized, 2);
        let stack = unstacked[0];
        for (let i = 1; i < min(unstacked.length, 3); i++) {
          stack = tf.add(stack, unstacked[i]);
        }
        //stack.print(true);
        return tf.div(stack, min(unstacked.length, 3) * 255).expandDims(2);
      });
      const prediction = model.predict(grayScaled.expandDims());
      const predArray = await prediction.array();
      res.json(
        Object.assign(
          {sucess: true},
          argMax(predArray[0])
        )
      )
    }
  }) 
});
router.use('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
})
module.exports = router;
