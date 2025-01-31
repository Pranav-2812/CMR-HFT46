const express = require("express");
const router = express.Router()
const Locations = require("../models/Locations");
const User = require("../models/Users");
const getuser = require("../middleware/getuser");
const City = require("../models/Cities");
const transactions = require("../models/Transactions");
const pendingLocations = require("../models/PendingLocations");
const UserVehicle = require("../models/UserVehicle");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//get user vehicle details
router.get("/getVehicle", getuser, async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ success: false, msg: "Not Authorised!" });
        }
        let userVehicle = await UserVehicle.find({ userId: user.id });
        if (!userVehicle) {
            return res.status(404).json({ success: false, msg: "No Vehicle found! Register one." });
        }
        return res.status(200).json({ success: true, userVehicle });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, msg: error.message });
    }
})


router.post("/add/vehicle", getuser, async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ success: false, msg: "Not Authorised!" });
        }
        const { vehicle_number, vehicle_type } = req.body;
        let userVehicle = await UserVehicle.findOne({ vehicle_number: vehicle_number });
        if (userVehicle) {
            return res.status(400).json({ success: false, msg: "Vehicle already registerd!" });
        }
        userVehicle = await UserVehicle.create({
            userId: user.id,
            vehicle_number: vehicle_number,
            vehicle_type: vehicle_type
        });
        user = await User.findByIdAndUpdate(user.id, { vehicles: user.vehicles + 1 }, { new: true });
        return res.status(200).json({ success: true, userVehicle });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, msg: error.message });
    }
})
router.get("/usr/transactions", getuser, async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ success: false, msg: "Not Authorised!" });
        }
        let transaction = await transactions.find({ name: user.id });

        if (!transaction) {
            return res.status(200).json({ success: false, msg: "No Transactions so far!" });
        }
        res.status(200).json({ success: true, transaction });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Some Error Occured" });
    }
});

router.post("/list", getuser, upload.array("files", 2), async (req, res) => {
    try {
        const { city, address, lat1, long1, lat2, long2, lat3, long3, lat4, long4 } = req.body;
        const files = req.files;

        // Validate required fields
        if (!city || !address || !lat1 || !lat2 || files.length < 2) {
            return res.status(400).json({ success: false, msg: "Incomplete data. Ensure all fields and two images are provided." });
        }

        // Process file uploads
        const uploadedFiles = [];

        for (const file of files) {
            const uploadStream = gfsBucket.openUploadStream(file.originalname, { contentType: file.mimetype });
            uploadStream.end(file.buffer);

            await new Promise((resolve, reject) => {
                uploadStream.on("finish", () => {
                    uploadedFiles.push(file.originalname);
                    resolve();
                });
                uploadStream.on("error", (err) => reject(err));
            });
        }

        // Save data to database
        const newLocation = await pendingLocations.create({
            city,
            address,
            lat1,
            long1,
            lat2,
            long2,
            lat3,
            long3,
            lat4,
            long4,
            img1: uploadedFiles[0], // Assign uploaded image filenames dynamically
            img2: uploadedFiles[1]
        });

        res.status(200).json({ success: true, msg: "Location saved successfully", location: newLocation });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

module.exports = router;