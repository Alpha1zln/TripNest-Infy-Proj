package com.tripnest.backend.config;

import com.tripnest.backend.security.OAuth2LoginSuccessHandler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    public SecurityConfig(
            OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {

        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(Customizer.withDefaults())

            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.IF_REQUIRED
                )
            )

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                .anyRequest().authenticated()
            )

            .oauth2Login(oauth2 ->
                oauth2.successHandler(
                    oAuth2LoginSuccessHandler
                )
            )

            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(Customizer.withDefaults())
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config =
                new CorsConfiguration();

        config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174"
        ));

        config.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS",
            "HEAD"
        ));

        config.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Accept",
            "X-Requested-With",
            "Origin"
        ));

        config.setExposedHeaders(
            List.of("Authorization")
        );

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config
        );

        return source;
    }
}

// try 3 ***
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;

// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.List;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

//         // http.csrf(csrf -> csrf.disable())
//         //     .authorizeHttpRequests(auth -> auth
//         http
//             .cors(cors -> {})
//             .csrf(csrf -> csrf.disable())
//             .authorizeHttpRequests(auth -> auth
//                     .requestMatchers("/api/auth/register").permitAll()
//                     .requestMatchers("/api/auth/login").permitAll()
//                     // Allow all preflight OPTIONS requests from the browser
//                     .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                     // Public authentication endpoints
//                     .requestMatchers("/api/auth/**").permitAll()
//                     // Everything else requires a valid JWT
//                     .anyRequest().authenticated()
//             )
//             .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}));

//         return http.build();
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

    
//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {

//         CorsConfiguration configuration = new CorsConfiguration();
        
//         // React Vite frontend
//         configuration.setAllowedOrigins(
//                 List.of("http://localhost:5173", "http://127.0.0.1:5173")
//         );

//         configuration.setAllowedMethods(
//                 List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
//         );

//         configuration.setAllowedHeaders(
//                 List.of("*")
//         );

//         UrlBasedCorsConfigurationSource source =
//                 new UrlBasedCorsConfigurationSource();

//         source.registerCorsConfiguration("/**", configuration);

//         return source;
//     }

// }




// try 2 ---
// package com.tripnest.backend.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {


//         // sec lvl 1 = csrf = 
//         // sec lvl 2 = auth = is person auth ?
//         http
//             .csrf(csrf -> csrf.disable())            
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers("/api/auth/register").permitAll()
//                 .anyRequest().authenticated()
//         );

//         return http.build();
//     }
// }




// try 1 *** 
// package com.tripnest.backend.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) 
//         throws Exception {

//         http.authorizeHttpRequests(auth -> auth.requestMatchers("/api/auth/register").permitAll().anyRequest().authenticated()
//         );

//         return http.build();
//     }
// }