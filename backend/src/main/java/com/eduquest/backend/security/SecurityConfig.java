package com.eduquest.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    /**
     * Bean para el filtro de autenticación JWT, que intercepta las peticiones y valida el token.
     * 
     * @return JwtAuthenticationFilter
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenUtil);
    }

    /**
     * Configuración principal de seguridad HTTP.
     * - Habilita CORS
     * - Desactiva CSRF (porque usamos JWT y APIs REST)
     * - Configura manejo de excepciones para accesos no autorizados
     * - Usa sesiones sin estado (stateless)
     * - Define reglas de autorización para endpoints públicos y protegidos
     * - Configura login OAuth2 con un handler para éxito
     * - Añade el filtro JWT antes del filtro estándar de autenticación por formulario
     * 
     * @param http HttpSecurity para configurar la seguridad web
     * @return SecurityFilterChain con la configuración aplicada
     * @throws Exception en caso de error en la configuración
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .exceptionHandling()
                .authenticationEntryPoint(unauthorizedHandler)
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**", "/oauth2/**").permitAll()  // Endpoints públicos
                .anyRequest().authenticated()                            // Resto requiere autenticación
            )
            .oauth2Login()
                .successHandler(oAuth2LoginSuccessHandler);             // Handler al login exitoso con OAuth2

        // Añade el filtro JWT antes del filtro de autenticación estándar
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Bean para obtener el AuthenticationManager que maneja la autenticación.
     * Necesario para la configuración de seguridad y servicios que lo requieran.
     * 
     * @param config AuthenticationConfiguration inyectado por Spring
     * @return AuthenticationManager
     * @throws Exception en caso de error al obtener el manager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Bean para codificar las contraseñas con BCrypt.
     * Usado para hashing seguro de contraseñas en el registro y login.
     * 
     * @return PasswordEncoder con implementación BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
