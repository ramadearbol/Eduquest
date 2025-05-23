package com.eduquest.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.annotations.GenerationTime;

@Entity
@Table(name = "usuarios")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_usuario", columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id_usuario;

    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    @Size(max = 50, message = "El nombre de usuario debe tener máximo 50 caracteres")
    private String username;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Debe ser un email válido")
    @Size(max = 100, message = "El email debe tener máximo 100 caracteres")
    private String email;

    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 6, message = "La contraseña debe tener mínimo 6 caracteres")
    private String password;

    @Column(name = "fecha_registro", updatable = false, insertable = false)
    private LocalDate fechaRegistro;

    @Column(name = "imagen_usuario")
    private String imagenUsuario;

    public User() {}

    // Getters y setters

    public UUID getId() {
        return id_usuario;
    }

    public void setId(UUID id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public String getImagenUsuario() {
        return imagenUsuario;
    }

    public void setImagenUsuario(String imagenUsuario) {
        this.imagenUsuario = imagenUsuario;
    }
}
