import mongoose from "mongoose";

// Define the schema for an event in the MongoDB database
const eventSchema = new mongoose.Schema({
	eventType: {
		type: String, // Specifies the type of the event
		required: true, // Ensures this field is mandatory
	},
	timestamp: {
		type: Date, // Records the date and time of the event
		default: Date.now, // Defaults to the current date and time if not provided
	},
	sourceAppId: {
		type: String, // Identifies the source application generating the event
		required: true, // Ensures this field is mandatory
	},
	data: {
		type: mongoose.Schema.Types.Mixed, // Allows storing data of any type
		required: true, // Ensures this field is mandatory
	},
	hash: {
		type: String, // Unique hash representing the current event
		required: true, // Ensures this field is mandatory
	},
	previousHash: {
		type: String, // Hash of the previous event for chaining events (blockchain-style)
		required: true, // Ensures this field is mandatory
	},
});

// Create a model for the event schema
const Event = mongoose.model("Event", eventSchema);

export default Event; // Export the Event model for use in other parts of the application
