import mongoose from "mongoose";

// Define the schema for the 'Event' collection
const eventSchema = new mongoose.Schema({
	eventType: {
		type: String,
		required: true, // Event type is required (e.g., "click", "view")
	},
	timestamp: {
		type: Date,
		default: Date.now, // Automatically set to the current date and time if not provided
	},
	sourceAppId: {
		type: String,
		required: true, // The ID of the application that generated the event is required
	},
	data: {
		type: mongoose.Schema.Types.Mixed, // Can store any type of data related to the event
		required: true, // Event data is mandatory
	},
	hash: {
		type: String,
		required: true, // Hash for ensuring data integrity is required
	},
	previousHash: {
		type: String,
		required: true, // Hash of the previous event in the chain for immutability
	},
});

// Create the 'Event' model using the schema
const Event = mongoose.model("Event", eventSchema);
export default Event;
