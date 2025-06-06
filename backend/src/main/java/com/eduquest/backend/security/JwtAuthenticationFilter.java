package com.eduquest.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;

    /**
     * Constructor que recibe la utilidad para manejo de tokens JWT.
     * 
     * @param jwtTokenUtil Utilidad para extraer y validar tokens JWT.
     */
    public JwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    /**
     * Método principal del filtro que se ejecuta en cada solicitud HTTP.
     * Valida el token JWT y configura el contexto de seguridad si es válido.
     *
     * @param request  La solicitud HTTP entrante.
     * @param response La respuesta HTTP.
     * @param filterChain Cadena de filtros para continuar el procesamiento.
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Excluir rutas públicas (registro, login, OAuth2) de la validación JWT
        if (path.startsWith("/auth/") || path.startsWith("/oauth2/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraer token JWT de la solicitud
        final String token = jwtTokenUtil.getTokenFromRequest(request);

        // Validar token y establecer autenticación si es válido
        if (token != null && jwtTokenUtil.validateToken(token)) {
            String username = jwtTokenUtil.getUsernameFromToken(token);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    username, null, null); // No roles ni credenciales adicionales
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Establecer la autenticación en el contexto de seguridad de Spring
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
