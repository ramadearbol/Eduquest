package com.eduquest.backend.controller;

import com.eduquest.backend.dto.UserDto;
import com.eduquest.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        String token = authService.register(userDto.getUsername(), userDto.getEmail(), userDto.getPassword());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto) {
        String token = authService.login(userDto.getEmail(), userDto.getPassword());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
