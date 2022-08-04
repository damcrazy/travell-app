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

router.get("/", async (req, res) => {
  try {
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
  // console.log(req.query.user);
  // console.log(req.params.id);
  try{
  const findthis = await Pin.find({ _id: req.params.id, username: req.query.user });
  console.log(findthis);
  if(findthis.length > 0){
    await Pin.deleteOne({ _id: req.params.id, username: req.query.user });
    const pins = await Pin.find();
    res.status(200).json(pins);
  }else { 
    res.status(400).json("Login to delete");
  }
} catch {
    res.status(500).json(err);
  }
  // try {
  //   const del = await Pin.deleteOne({ "_id": req.params.id });
  //   console.log(del);
  //   const pins = await Pin.find();       
  //   res.status(200).json(pins);
  // } catch (err) {
  //   res.status(500).json(err);
  // }
});
module.exports = router;
