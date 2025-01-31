const { body, validationResult } = require('express-validator')
const express = require("express")
const router = express.Router();
const Owner = require("../models/Owner")
const Locations = require("../models/Locations");
const City = require("../models/Cities");
const bikeSlot = require("../models/BikeSlot");
const carSlot = require("../models/CarSlots");
// const JWTSecrect = process.env.VITE_JWT_SECRECT;
const getowner = require("../middleware/getowner");
const loaction = require('../models/Locations');
router.post("/add_loc/:id", [body("city").isEmpty(), body("address").isEmpty(), body("latitude").isNumeric(), body("longitude").isNumeric()], getowner, async (req, res) => {
    const { city, address, latitude, longitude, location_type, car_slots, bike_slots } = req.body;
    try {
        let owner = await Owner.findById(req.params.id)
        if (!owner) {
            return res.status(404).json({ success: false, msg: "owner not found" });
        }
        let location = await Locations.findOne({ address: address });

        if (location) {
            console.log(location)
            return res.status(400).json({ success: false, msg: "locations already exists" });

        }
        location = await Locations.create({
            owner: owner.id,
            city: city,
            address: address,
            latitude: latitude,
            longitude: longitude,
            location_type: location_type,
            car_slots: car_slots,
            bike_slots: bike_slots
        });
        let cities = await City.findOne({ name: city });
        if (!cities) {
            cities = await City.create({
                name: city,
                locations: 1
            });

        } else {
            cities = await City.findByIdAndUpdate(cities.id, { locations: cities.locations + 1 }, { new: true });
        }
        if (car_slots && car_slots !== 0) {
            for (let index = 0; index < car_slots; index++) {
                await carSlot.create({
                    slot_no: location.id + String(index + 1),
                    location: location.id,
                    isAvailable: true
                });

            }

        }
        if (bike_slots && bike_slots !== 0) {
            for (let index = 0; index < bike_slots; index++) {
                await bikeSlot.create({
                    slot_no: location.id + String(index + 1),
                    location: location.id,
                    isAvailable: true
                });

            }
        }
        owner = await Owner.findByIdAndUpdate(req.params.id, { locations: owner.locations + 1 }, { new: true });
        res.status(200).json({ success: true, location, owner, cities })
    } catch (error) {
        console.log(error)
    }
});
router.put("/update/locations/:id", getowner, async (req, res) => {

    const { city, address, latitude, longitude, location_type, car_slots, bike_slots } = req.body;
    try {

        let location = await Locations.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ success: false, msg: "location not found" })
        }

        if (location.owner.toString() !== req.owner.id) {
            return res.status(401).json({ success: false, msg: "Not Authorized" });
        }
        const newData = {}
        if (city) {
            newData.city = city
        }
        if (address) {
            newData.address = address
        }
        if (latitude) {
            newData.latitude = latitude
        }
        if (longitude) {
            newData.longitude = longitude
        }
        if (location_type) {
            newData.location_type = location_type
        }
        if (car_slots || car_slots === 0) {
            newData.car_slots = car_slots
        }
        if (bike_slots || bike_slots === 0) {
            newData.bike_slots = bike_slots
        }
        let oldCarCount = location.car_slots
        let oldBikeCount = location.bike_slots
        location = await Locations.findByIdAndUpdate(req.params.id, { $set: newData }, { new: true });

        if (oldCarCount > car_slots) {

            for (let index = car_slots + 1; index <= oldCarCount; index++) {
                // console.log(location.id + String(index))
                await carSlot.deleteOne({ slot_no: location.id + String(index) });

            }
        } else if (oldCarCount < car_slots) {
            for (let index = oldCarCount + 1; index <= car_slots; index++) {
                // console.log(location.id + String(index))
                await carSlot.create({
                    slot_no: location.id + String(index),
                    location: location.id,
                    isAvailable: true
                })

            }
        }


        if (oldBikeCount > bike_slots) {
            for (let index = bike_slots + 1; index <= oldBikeCount; index++) {
                // console.log(location.id + String(index))
                await bikeSlot.deleteOne({ slot_no: location.id + String(index) });

            }
        } else if (oldBikeCount < bike_slots) {
            for (let index = oldBikeCount + 1; index <= bike_slots; index++) {
                // console.log(location.id + String(index))
                await bikeSlot.create({
                    slot_no: location.id + String(index),
                    location: location.id,
                    isAvailable: true
                })

            }
        }


        res.status(200).json({ success: true, location });
    } catch (error) {
        console.log(error)
    }
})
router.get("/get-pending", getowner, async (req, res) => {
    if (!req.owner) return res.status(501).send("Not Authorized");
    try {
        // Fetch all pending locations
        const locations = await pendingLocations.find();

        if (!locations || locations.length === 0) {
            return res.status(404).json({ success: false, msg: "No pending locations found" });
        }

        // Construct response with image URLs
        const formattedLocations = locations.map(location => ({
            _id: location._id,
            city: location.city,
            address: location.address,
            coordinates: {
                lat1: location.lat1, long1: location.long1,
                lat2: location.lat2, long2: location.long2,
                lat3: location.lat3, long3: location.long3,
                lat4: location.lat4, long4: location.long4,
            },
            images: [
                `${req.protocol}://${req.get("host")}/get-image/${location.img1}`,
                `${req.protocol}://${req.get("host")}/get-image/${location.img2}`
            ],
            
        }));

        res.status(200).json({ success: true, locations: formattedLocations });
   
    } catch (error) {
        console.error("Error fetching pending locations:", error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});


router.get("/get-image/:filename", async (req, res) => {
    try {
        const file = await gfsBucket.find({ filename: req.params.filename }).toArray();

        if (!file || file.length === 0) {
            return res.status(404).json({ success: false, msg: "Image not found" });
        }

        // Set the content type and stream the image
        res.set("Content-Type", file[0].contentType);
        const readStream = gfsBucket.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

module.exports = router;