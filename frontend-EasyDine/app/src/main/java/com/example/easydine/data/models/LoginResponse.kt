package com.example.easydine.data.models

data class LoginResponse(
    val success: Boolean,
    val message: String,
    val token: String? = null
)
