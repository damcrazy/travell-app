const router = require("express").Router();
const Pin = require("../models/Pin");

//create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  // console.log(newPin);
  try {
    const savedPin = await newPin.save();
    console.log(savedPin);
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    // const pins = await Pin.find({ "_id": "62b5f2adba1df848bc720df3" });    

    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/:type", async (req, res) => {
  try {
    const places = await Pin.find({ "type": { $regex: req.params.type } });
    
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/delete/:id", async (req, res) => {
  // console.log(id)
  try {

    const del = await Pin.deleteOne({ "_id": req.params.id });
    console.log(del);
    const pins = await Pin.find();    
    // const pins = await Pin.find();    
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
