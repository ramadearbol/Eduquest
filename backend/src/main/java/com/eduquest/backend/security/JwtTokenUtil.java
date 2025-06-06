package com.eduquest.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secretKeyString;

    @Value("${jwt.expiration}")
    private long expirationTime;

    /**
     * Obtiene la clave secreta para firmar el token a partir de la cadena configurada.
     * 
     * @return SecretKey utilizada para la firma HMAC SHA-512
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKeyString.getBytes());
    }

    /**
     * Genera un token JWT con el email y el id del usuario como claims.
     * 
     * @param email      Email del usuario (subject)
     * @param idUsuario  UUID del usuario agregado como claim personalizado
     * @return           Token JWT firmado y compacto
     */
    public String generateToken(String email, UUID idUsuario) {
        return Jwts.builder()
                .setSubject(email)
                .claim("id_usuario", idUsuario.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Extrae el nombre de usuario (subject) del token JWT.
     * 
     * @param token Token JWT
     * @return      Email o nombre de usuario contenido en el subject del token
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Valida la integridad y vigencia del token JWT.
     * 
     * @param token Token JWT a validar
     * @return      true si el token es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Token inválido o mal formado
            return false;
        }
    }

    /**
     * Extrae el token JWT de la cabecera Authorization de la petición HTTP.
     * 
     * @param request Petición HTTP
     * @return        Token JWT sin el prefijo "Bearer ", o null si no existe o está mal formado
     */
    public String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * Obtiene todos los claims (información) almacenados en el token JWT.
     * 
     * @param token Token JWT
     * @return      Claims contenidos en el token
     */
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
