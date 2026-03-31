const responseSchemas = {
    BaseResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "successful operation" },
            data: { type: "object", nullable: true }
        }
    },
    ErrorResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "An error occurred" }
        }
    }
}

export { responseSchemas };