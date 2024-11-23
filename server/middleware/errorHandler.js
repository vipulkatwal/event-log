// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
	console.error("❌ Error:", err.stack); // Log the error stack for debugging purposes

	// Handle MongoDB-specific errors
	if (err.name === "MongoError" || err.name === "MongoServerError") {
		return res.status(500).json({
			error: {
				message: "Database error occurred", // Generic message for database-related errors
				status: 500, // Internal server error status
			},
		});
	}

	// Handle validation errors (e.g., data validation in Mongoose)
	if (err.name === "ValidationError") {
		return res.status(400).json({
			error: {
				message: err.message, // Provide the validation error message
				status: 400, // Bad request status
			},
		});
	}

	// Handle any other errors with a default response
	res.status(err.status || 500).json({
		error: {
			message: err.message || "Internal Server Error", // Use a generic message if none is provided
			status: err.status || 500, // Default to internal server error if no status is defined
		},
	});
};
