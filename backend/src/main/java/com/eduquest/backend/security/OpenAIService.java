package com.eduquest.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();


    public String generarPreguntaVerdadero(String mundo, int dificultad) {
        String prompt = String.format(
            "Genera una pregunta tipo verdadero o falso sobre %s con dificultad %d. " +
            "Responde SOLO con un JSON válido y sin texto adicional. Formato:\n" +
            "{\"pregunta\": \"¿Una clase en Java puede tener múltiples constructores?\", \"respuesta_correcta\": \"verdadero\"}",
            mundo, dificultad
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return message.get("content").toString(); // Esto debe ser un JSON puro
    }

    public String generarPreguntaDefinicion(String mundo, int dificultad) {
        String prompt = String.format(
            "Genera una pregunta de tipo definición para estudiantes principiantes sobre %s con dificultad %d. " +
            "El formato de salida debe ser estrictamente JSON, sin texto adicional. Ejemplo:\n" +
            "{\"pregunta\": \"¿Qué es una variable en Java?\", \"opciones\": [\"Un tipo de dato\", \"Una función\", \"Una ubicación en memoria\", \"Un paquete\"], \"respuesta_correcta\": \"Una ubicación en memoria\"}",
            mundo, dificultad
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

        return message.get("content").toString();
    }

    public String generarPreguntaOpcionMultiple(String mundo, int dificultad) {
        String prompt = String.format(
            "Genera una pregunta de opción múltiple sobre %s con dificultad %d para estudiantes principiantes. " +
            "Debe tener 4 opciones y una única respuesta correcta. El formato debe ser JSON estricto, sin texto adicional. Ejemplo:\n" +
            "{\"pregunta\": \"¿Cuál de estos es un tipo de dato primitivo en Java?\", \"opciones\": [\"int\", \"String\", \"float\", \"boolean\"], \"respuesta_correcta\": \"int\"}",
            mundo, dificultad
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

        return message.get("content").toString();
    }

    public String generarPreguntaCompletarCodigo(String mundo, int dificultad) {
        String prompt = String.format(
            "Genera una pregunta para completar código en Java sobre %s con dificultad %d. " +
            "La pregunta debe tener un fragmento de código con una parte faltante representada por guiones bajos o espacios. " +
            "El resultado debe ser estrictamente JSON, sin texto adicional. Ejemplo:\n" +
            "{\"pregunta\": \"Completa el siguiente código para imprimir 'Hola Mundo':\", " +
            "\"codigo\": \"public class Main {\\n  public static void main(String[] args) {\\n    System.out._____(\\\"Hola Mundo\\\");\\n  }\\n}\", " +
            "\"respuesta_correcta\": \"println\"}",
            mundo, dificultad
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

        return message.get("content").toString();
    }

    public String generarPreguntaRelacionarConceptos(String mundo, int dificultad) {
        String prompt = String.format(
            "Genera una pregunta de tipo relacionar conceptos para principiantes sobre %s con dificultad %d. " +
            "El formato de salida debe ser JSON estricto. Ejemplo:\n" +
            "{\"pregunta\": \"Relaciona cada concepto con su definición:\", " +
            "\"conceptos\": [\"Clase\", \"Método\", \"Variable\"], " +
            "\"definiciones\": {\"Clase\": \"Define un tipo de objeto.\", \"Método\": \"Contiene instrucciones que se ejecutan.\", \"Variable\": \"Almacena datos.\"}}",
            mundo, dificultad
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

        return message.get("content").toString();
    }

}