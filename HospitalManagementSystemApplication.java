package com.ksk.hospital_management_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
@EnableMongoAuditing
@EnableMethodSecurity(jsr250Enabled = true,securedEnabled = true)
public class HospitalManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(HospitalManagementSystemApplication.class, args);
	}

	@Bean
	public FilterRegistrationBean<CorsFilter> filterRegistrationBean(){
		final CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		// In production, replace "*" with your frontend's origin.
		config.addAllowedOrigin("http://localhost:5173");  // For development
		// config.addAllowedOrigin("https://your-frontend-domain.com");  // For production
		config.addAllowedHeader("*");
		config.addAllowedMethod("*");  // Allowing all HTTP methods
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);  // Apply CORS configuration globally
		FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
		bean.setOrder(Ordered.HIGHEST_PRECEDENCE);  // Ensure CORS filter runs first
		return bean;
	}
}