const express = require("express");
const router = express.Router();

const {
getBuses,
getActiveBuses,
createBus,
updateBus,
deleteBus,
getBusLocation,
updateBusLocation,
getBusStats
} = require("../controllers/busController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

/* PUBLIC */
router.get("/", getBuses);
router.get("/active", getActiveBuses);
router.get("/stats", getBusStats);
router.get("/:id/location", getBusLocation);

/* DRIVER / ADMIN */
router.put(
"/:id/location",
protect,
authorize("driver","admin"),
updateBusLocation
);

/* ADMIN */
router.post(
"/",
protect,
authorize("admin"),
createBus
);

router.put(
"/:id",
protect,
authorize("admin"),
updateBus
);

router.delete(
"/:id",
protect,
authorize("admin"),
deleteBus
);

module.exports = router;