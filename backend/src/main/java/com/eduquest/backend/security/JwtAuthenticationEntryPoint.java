package com.eduquest.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    /**
     * Método que se ejecuta cuando un usuario no autorizado intenta acceder a un recurso protegido.
     * Envía una respuesta HTTP 401 (Unauthorized) al cliente.
     * 
     * @param request   La solicitud HTTP entrante.
     * @param response  La respuesta HTTP que se enviará.
     * @param authException La excepción lanzada que indica la falta de autenticación.
     * @throws IOException En caso de error de entrada/salida al enviar la respuesta.
     * @throws ServletException Excepción de servlet.
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}
