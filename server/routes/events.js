import express from "express";
import Event from "../models/Event.js";
import CryptoJS from "crypto-js";

const router = express.Router(); // Create a new router instance

// Utility function to generate a SHA256 hash for an event
const generateHash = (event) => {
	const data = JSON.stringify({
		eventType: event.eventType,
		timestamp: event.timestamp,
		sourceAppId: event.sourceAppId,
		data: event.data,
		previousHash: event.previousHash,
	});
	return CryptoJS.SHA256(data).toString(); // Generate and return the hash
};

// Endpoint to fetch the most recent 50 events
router.get("/", async (req, res) => {
	try {
		const events = await Event.find().sort({ timestamp: -1 }).limit(50); // Fetch events sorted by latest timestamp
		res.json(events); // Return the events as a JSON response
	} catch (error) {
		res.status(500).json({ message: error.message }); // Handle and return any server errors
	}
});

// Endpoint to create a new event
router.post("/", async (req, res) => {
	try {
		const lastEvent = await Event.findOne().sort({ timestamp: -1 }); // Get the latest event to retrieve its hash
		const previousHash = lastEvent ? lastEvent.hash : "0"; // Use '0' if no previous events exist

		const newEvent = new Event({
			...req.body, // Spread the incoming event data
			timestamp: new Date(), // Assign the current timestamp
			previousHash, // Assign the hash of the last event
		});

		newEvent.hash = generateHash(newEvent); // Generate the hash for the new event
		const savedEvent = await newEvent.save(); // Save the event to the database

		// Emit the new event through Socket.IO for real-time updates
		req.app.get("io").emit("newEvent", savedEvent);

		res.status(201).json(savedEvent); // Respond with the created event
	} catch (error) {
		res.status(400).json({ message: error.message }); // Handle and return any client-side errors
	}
});

// Endpoint to search for events based on filters
router.get("/search", async (req, res) => {
	try {
		const { eventType, sourceAppId, startDate, endDate } = req.query; // Destructure query parameters
		const query = {}; // Initialize the query object

		// Add filters to the query if provided
		if (eventType) query.eventType = eventType;
		if (sourceAppId) query.sourceAppId = sourceAppId;
		if (startDate || endDate) {
			query.timestamp = {};
			if (startDate) query.timestamp.$gte = new Date(startDate); // Filter events after startDate
			if (endDate) query.timestamp.$lte = new Date(endDate); // Filter events before endDate
		}

		const events = await Event.find(query).sort({ timestamp: -1 }); // Execute the query and sort by timestamp
		res.json(events); // Return the matching events as a JSON response
	} catch (error) {
		res.status(500).json({ message: error.message }); // Handle and return any server errors
	}
});

export default router;
