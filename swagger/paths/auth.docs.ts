const authPaths = {
    "/v1/auth/": {
        post: {
            summary: "Login",
            tags: ["Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json" : {
                        schema: {
                            type: "object",
                            properties: {
                                username: { type: "string", example: "username" },
                                password: { type: "string", example: "Password@123" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    success: true,
                    message: "Logged in"
                },
                400: {
                    success: false,
                    message: "Please provide valid data" 
                },
                401: {
                    success: false,
                    message: "Invalid login credentials"
                }
            }
        }
    },
    "/v1/auth/:flag": {
        get: {
            summary: "Logout",
            tags: ["Auth"],
            parameters: [
                {
                    name: "flag",
                    in: "path",
                    required: true,
                    schema: { type: 'boolean' },
                    description: "Flag for logout from all devices or not"
                }
            ],
            responses: {
                200: {
                    success: true,
                    message: "Logged out"
                },
                404: {
                    success: false,
                    message: "Resource not found!"
                },
                403: {
                    success: false,
                    message: "Forbidden!"
                }
            }
        }
    },
    "/v1/auth/forget/:email": {
        get: {
            summary: "Forget password",
            tags: ["Auth"],
            parameters: [
                {
                    name: "email",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "Unique email of user"
                }
            ],
            responses: {
                200: {
                    success: true,
                    message: "Forget password token generated",
                    data: "token"
                },
                404: {
                    success: false,
                    message: "Resource not found!"
                } 
            }
        }
    },
    "/v1/auth/:token": {
        patch: {
            summary: "Change password",
            tags: ["Auth"],
            parameters: [
                {
                    name: "token",
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                    description: "Forget password token"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                password: { type: "string", example: "Password@123" }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    success: true,
                    message: "Password changed successfully"
                },
                404: {
                    success: false,
                    message: "Resource not found!"
                },
                400: {
                    success: false,
                    message: "Please provide valid data"
                }
            }
        }
    }
}

export { authPaths }