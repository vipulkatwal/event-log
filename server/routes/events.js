import express from "express";
import Event from "../models/Event.js";
import CryptoJS from "crypto-js";

const router = express.Router();

// Utility function to generate a hash for an event
const generateHash = (event) => {
	// Combine event data into a single string for hashing
	const data = JSON.stringify({
		eventType: event.eventType,
		timestamp: event.timestamp,
		sourceAppId: event.sourceAppId,
		data: event.data,
		previousHash: event.previousHash,
	});
	// Generate a SHA256 hash of the data
	return CryptoJS.SHA256(data).toString();
};

// Route: GET /
// Description: Fetch the latest 50 events sorted by timestamp (most recent first)
router.get("/", async (req, res) => {
	try {
		const events = await Event.find().sort({ timestamp: -1 }).limit(50); // Query to get latest events
		res.json(events); // Respond with the fetched events
	} catch (error) {
		res.status(500).json({ message: error.message }); // Handle errors during query execution
	}
});

// Route: POST /
// Description: Create a new event
router.post("/", async (req, res) => {
	try {
		// Get the last event to determine the previous hash
		const lastEvent = await Event.findOne().sort({ timestamp: -1 });
		const previousHash = lastEvent ? lastEvent.hash : "0"; // Use '0' if no prior event exists

		// Create a new event object
		const newEvent = new Event({
			...req.body, // Spread operator to include body fields in the new event
			timestamp: new Date(), // Set the current timestamp
			previousHash, // Set the previous hash
		});

		// Generate hash for the new event
		newEvent.hash = generateHash(newEvent);

		// Save the event to the database
		const savedEvent = await newEvent.save();

		// Emit the new event using Socket.IO for real-time updates
		req.app.get("io").emit("newEvent", savedEvent);

		// Respond with the saved event
		res.status(201).json(savedEvent);
	} catch (error) {
		res.status(400).json({ message: error.message }); // Handle validation or other errors
	}
});

// Route: GET /search
// Description: Search for events based on query parameters
router.get("/search", async (req, res) => {
	try {
		const { eventType, sourceAppId, startDate, endDate } = req.query; // Extract query parameters
		const query = {}; // Initialize query object

		// Add filters to the query object based on provided parameters
		if (eventType) query.eventType = eventType; // Filter by event type
		if (sourceAppId) query.sourceAppId = sourceAppId; // Filter by source app ID
		if (startDate || endDate) {
			query.timestamp = {}; // Initialize timestamp filter
			if (startDate) query.timestamp.$gte = new Date(startDate); // Start date filter
			if (endDate) query.timestamp.$lte = new Date(endDate); // End date filter
		}

		// Execute the query and fetch matching events
		const events = await Event.find(query).sort({ timestamp: -1 });
		res.json(events); // Respond with the fetched events
	} catch (error) {
		res.status(500).json({ message: error.message }); // Handle errors during query execution
	}
});

export default router; // Export the router to be used in the application
