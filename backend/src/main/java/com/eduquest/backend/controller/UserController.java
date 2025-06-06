package com.eduquest.backend.controller;

import com.eduquest.backend.model.User;
import com.eduquest.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Obtiene los datos del usuario actualmente autenticado.
     * @param principal Representa al usuario autenticado
     * @return Objeto User con los datos del usuario
     * @throws RuntimeException si no hay usuario autenticado o no se encuentra el usuario
     */
    @GetMapping("/me")
    public User getCurrentUser(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("No autorizado");
        }

        return userService.getUserByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    /**
     * Actualiza el perfil del usuario autenticado.
     * @param updatedData Datos actualizados del usuario (username, email, password)
     * @param oldPassword Contraseña actual para validar si se quiere cambiar la contraseña
     * @param principal Usuario autenticado
     * @return Usuario actualizado
     * @throws RuntimeException si no hay usuario autenticado o no se encuentra el usuario
     */
    @PutMapping("/me")
    public User updateProfile(@RequestBody User updatedData,
                              @RequestParam(required = false) String oldPassword,
                              Principal principal) {
        if (principal == null) {
            throw new RuntimeException("No autorizado");
        }

        User currentUser = userService.getUserByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return userService.updateUser(
            currentUser.getId(),
            updatedData.getUsername(),
            updatedData.getEmail(),
            updatedData.getPassword(),  // nueva contraseña (puede ser null)
            oldPassword                 // contraseña actual (necesaria si hay nueva)
        );
    }
}
