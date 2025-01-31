const express = require("express");
const router = express.Router()
const Locations = require("../models/Locations");
const User = require("../models/Users");
const getuser = require("../middleware/getuser");
const City = require("../models/Cities");
const Transactions = require("../models/Transactions");
const carSlot = require("../models/CarSlots");
const bikeSlot = require("../models/BikeSlot");
const UserVehicle = require("../models/UserVehicle");
//user specific search ,login required
router.post("/isAvailable/:id", getuser, async (req, res) => {
    const { city } = req.body;
    try {
        if (city !== null) {
            try {
                let city_name = await City.findOne({ name: city });
                if (!city_name) {
                    return res.json({ success: false, msg: `Sorry, No locations available in ${city}` });
                }
                let location = await Locations.find({ city: city_name.name });
                console.log(location, city_name);
                res.status(200).json({ success: true, city_name, location });
            } catch (error) {
                console.log(error);
                res.json({ success: false, msg: "Some Error occured" });
            }
        }
        else {
            try {
                let user;
                if (req.params.id !== undefined) {
                    user = await User.findById(req.params.id);
                    if (!user) {
                        return res.status(404).json({ success: false, msg: "User not found" });
                    }
                }
                else { return res.json({ success: false, msg: "Please reload the window" }) }
                let city_name = await City.findOne({ name: user.city });
                if (!city_name) {
                    return res.json({ success: false, msg: "Sorry, No locations available in your city", user, city_name });
                }
                let location = await Locations.find({ city: user.city });

                res.status(200).json({ success: true, city_name, location });
            } catch (error) {
                console.log(error)
                res.json({ success: false, msg: "Some Error occured" });
            }
        }

    }
    catch (error) {
        console.log(error)
        res.json({ success: false, msg: "Some Error occured" });
    }
});
//general search
router.post("/isAvailable", async (req, res) => {
    const { city } = req.body;
    try {
        let city_name = await City.findOne({ name: city });
        if (!city_name) {
            return res.json({ success: false, msg: `Sorry, No locations available in ${city}` });
        }
        let location = await Locations.find({ city: city_name.name });
        // console.log(location, city_name);
        res.status(200).json({ success: true, city_name, location });
    } catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Some Error occured" });
    }
})

router.get("/getLocation/carslots/:id", getuser, async (req, res) => {

    try {
        if (req.params.id === null) {
            console.log({ success: false, msg: "Please refresh" })
            return res.json({ success: false, msg: "Please refresh" });
        }
        let location = await Locations.findById(req.params.id);
        let user = await User.findById(req.user.id);
        if (!user) {
            console.log({ success: false, msg: "user not found" });
            return res.json({ success: false, msg: "user not found" });
        }
        let cars = await carSlot.find({ location: req.params.id });
        if (!cars) {
            return res.json({ success: false, msg: "No slots for cars found!" });
        }
        return res.status(200).json({ success: true, cars, location });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, msg: "Some Error occured" });
    }
})

router.get("/getLocation/bikeslots/:id", getuser, async (req, res) => {
    try {
        if (req.params.id === null) {
            console.log({ success: false, msg: "Please refresh" })
            return res.json({ success: false, msg: "Please refresh" });
        }
        let location = await Locations.findById(req.params.id);
        let user = await User.findById(req.user.id);
        if (!user) {
            console.log({ success: false, msg: "user not found" });
            return res.json({ success: false, msg: "user not found" });
        }
        let bikes = await bikeSlot.find({ location: req.params.id });
        if (!bikes) {
            return res.json({ success: false, msg: "No slots for bikes found!" });
        }
        return res.status(200).json({ success: true, bikes, location });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, msg: "Some Error occured" });
    }
})


//get parking location status
// router.get("/location/status/:id", getuser, async (req, res) => {

//     try {

//         if (req.params.id === null) {
//             console.log({ success: false, msg: "Please refresh" })
//             return res.json({ success: false, msg: "Please refresh" });
//         }
//         let user = await User.findById(req.user.id);
//         if (!user) {
//             console.log({ success: false, msg: "user not found" });
//             return res.json({ success: false, msg: "user not found" });
//         }
//         let vehicle;
//         if (user.vehicle_type === "car") {
//             if (req.params.id === null) {
//                 console.log({ success: false, msg: "Please refresh" });
//                 return res.json({ success: false, msg: "Please refresh" })
//             }
//             vehicle = await carSlot.find({ location: req.params.id })
//             if (!vehicle) {
//                 console.log({ success: false, msg: "some error occured" });
//                 return res.json({ success: false, msg: "some error occured" })
//             }
//             console.log({ success: true });
//             return res.status(200).json({ success: true, vehicle });
//         }
//         if (user.vehicle_type === "bike") {
//             if (req.params.id === null) {
//                 console.log({ success: false, msg: "Please refresh" });
//                 return res.json({ success: false, msg: "Please refresh" })
//             }
//             vehicle = await bikeSlot.find({ location: req.params.id })
//             if (!vehicle) {
//                 console.log({ success: false, msg: "some error occured" });
//                 return res.json({ success: false, msg: "some error occured" })
//             }
//             console.log({ success: true })
//             return res.status(200).json({ success: true, vehicle });
//         }

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, msg: "Some Error occured" });
//     }
// })
//book a slot ,login required
router.post("/book/slot/:id", getuser, async (req, res) => {
    const { duration, type } = req.body;
    const io = req.app.get("socket");
    io.emit("hi", "chalu ho gaya");
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.json({ success: false, msg: "Some error occured" });
        }
        let slot, charges;
        let isBike = false; 
        let isCar = false;
        let vehicles = await UserVehicle.find({ userId: user.id });
        vehicles.forEach((doc) => {
            if (doc.vehicle_type === "car") {
                isCar = true;
            }
            else if (doc.vehicle_type === "bike") {
                isBike = true;
            }
            else {
                return res.status(401).json({ success: false, msg: "Can't fetch Vehicles" });
            }
        }
        )
        if (type === "car") {
            if (isCar) {
                slot = await carSlot.findById(req.params.id);

                if (!slot) {
                    return res.json({ success: false, msg: "Some error occured" });
                }
                charges = 1 * duration;
                slot = await carSlot.findByIdAndUpdate(slot.id, { isAvailable: false, duration: duration }, { new: true });
            }
            else {
                return res.json({ success: false, msg: "You dont have a registered Car" });
            }
        }
        if (type === "bike") {
            if (isBike) {
                slot = await bikeSlot.findById(req.params.id);
                // console.log(slot);
                if (!slot) {
                    return res.json({ success: false, msg: "Somr error occured" });
                }
                charges = 0.5 * duration;
                slot = await bikeSlot.findByIdAndUpdate(slot.id, { isAvailable: false, duration: duration }, { new: true });
            }
            else {
                return res.json({ success: false, msg: "You dont have a registered bike" });
            }
        }
 
        let location = await Locations.findById(slot.location);
        let transaction = await Transactions.create({
            name: user.id,
            email: user.email,
            Mob_No: user.Mob_no,
            duration: duration,
            location: location.address,
            slot_no: slot.id,
            charges: charges,
            vehicle_type: user.vehicle_type,
            vehicle_number: user.vehicle_number,
            city: location.city,
            date: new Date()

        });
        res.status(200).json({ success: true, transaction, slot });
        io.emit("book", transaction);
    } catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Some Error occured" });
    }
});
router.post("/location/slot/update/:id", getuser, async (req, res) => {
    try {
        const { duration } = req.body;
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.json({ success: false, msg: "Not Authorized" });
        }
        if (user.vehicle_type === "car") {
            let slot = await carSlot.findByIdAndUpdate(req.params.id, { isAvailable: true, duration: duration }, { new: true });
            return res.status(200).json({ success: true, msg: "slot updated", slot });
        }
        if (user.vehicle_type === "bike") {
            let slot = await bikeSlot.findByIdAndUpdate(req.params.id, { isAvailable: true, duration: duration }, { new: true });
            return res.status(200).json({ success: true, msg: "slot updated", slot });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, msg: "Some Error occured" });
    }
})
module.exports = router;