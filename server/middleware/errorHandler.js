// Error handler middleware to handle and respond to application errors
export const errorHandler = (err, req, res, next) => {
	// Log the error stack trace to the console for debugging
	console.error("❌ Error:", err.stack);

	// Handle MongoDB-specific errors
	if (err.name === "MongoError" || err.name === "MongoServerError") {
		return res.status(500).json({
			error: {
				message: "Database error occurred", // Message for database-related errors
				status: 500, // HTTP status code for internal server error
			},
		});
	}

	// Handle validation errors (e.g., Mongoose schema validation)
	if (err.name === "ValidationError") {
		return res.status(400).json({
			error: {
				message: err.message, // Validation error message from the error object
				status: 400, // HTTP status code for bad request
			},
		});
	}

	// Default error handler for all other types of errors
	res.status(err.status || 500).json({
		error: {
			message: err.message || "Internal Server Error", // Generic error message
			status: err.status || 500, // HTTP status code; defaults to 500
		},
	});
};
