package com.eduquest.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    private final ObjectMapper objectMapper = new ObjectMapper();

    private Map<String, Object> callOpenAI(String prompt) throws Exception {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        requestBody.put("temperature", 0.7);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Error al llamar a OpenAI: " + response.getStatusCode());
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String content = message.get("content").toString();

        // Limpiar contenido: quitar bloques de código, comillas extras, etc.
        content = cleanOpenAIResponse(content);

        // Parsear JSON a Map
        return objectMapper.readValue(content, Map.class);
    }

    private String cleanOpenAIResponse(String content) {
        // Eliminar bloques de código markdown ```json ... ```
        content = content.trim();
        if (content.startsWith("```")) {
            int firstLineEnd = content.indexOf("\n");
            if (firstLineEnd > 0) {
                content = content.substring(firstLineEnd + 1);
            }
            if (content.endsWith("```")) {
                content = content.substring(0, content.length() - 3);
            }
            content = content.trim();
        }

        // A veces hay comillas extras al inicio o final que no son válidas, las eliminamos
        if ((content.startsWith("\"") && content.endsWith("\"")) ||
            (content.startsWith("'") && content.endsWith("'"))) {
            content = content.substring(1, content.length() - 1).trim();
        }

        return content;
    }

    public Map<String, Object> generarPreguntaVerdadero(String mundo, int dificultad) throws Exception {
        String prompt = String.format(
            "Genera una pregunta tipo verdadero o falso sobre %s con dificultad %d. " +
            "Responde SOLO con un JSON válido y sin texto adicional. Formato:\n" +
            "{\"pregunta\": \"¿Una clase en Java puede tener múltiples constructores?\", \"respuesta_correcta\": \"verdadero\"}",
            mundo, dificultad
        );
        return callOpenAI(prompt);
    }

    public Map<String, Object> generarPreguntaDefinicion(String mundo, int dificultad) throws Exception {
        String prompt = String.format(
            "Genera una pregunta de tipo definición para estudiantes principiantes sobre %s con dificultad %d. " +
            "El formato de salida debe ser estrictamente JSON, sin texto adicional. Ejemplo:\n" +
            "{\"pregunta\": \"¿Qué es una variable en Java?\", \"opciones\": [\"Un tipo de dato\", \"Una función\", \"Una ubicación en memoria\", \"Un paquete\"], \"respuesta_correcta\": \"Una ubicación en memoria\"}",
            mundo, dificultad
        );
        return callOpenAI(prompt);
    }

    public Map<String, Object> generarPreguntaOpcionMultiple(String mundo, int dificultad) throws Exception {
        String prompt = String.format(
            "Genera una pregunta de opción múltiple sobre %s con dificultad %d para estudiantes principiantes. " +
            "Debe tener 4 opciones y una única respuesta correcta. El formato debe ser JSON estricto, sin texto adicional. Ejemplo:\n" +
            "{\"pregunta\": \"¿Cuál de estos es un tipo de dato primitivo en Java?\", \"opciones\": [\"int\", \"String\", \"float\", \"boolean\"], \"respuesta_correcta\": \"int\"}",
            mundo, dificultad
        );
        return callOpenAI(prompt);
    }

    public Map<String, Object> generarPreguntaCompletarCodigo(String mundo, int dificultad) throws Exception {
        String prompt = String.format(
            "Genera una pregunta para completar código en Java sobre %s con dificultad %d. " +
            "La pregunta debe tener un fragmento de código con una parte faltante representada por guiones bajos o espacios. " +
            "El resultado debe ser estrictamente JSON, sin texto adicional. Ejemplo:\n" +
            "{\"pregunta\": \"Completa el siguiente código para imprimir 'Hola Mundo':\", " +
            "\"codigo\": \"public class Main {\\n  public static void main(String[] args) {\\n    System.out._____(\\\"Hola Mundo\\\");\\n  }\\n}\", " +
            "\"respuesta_correcta\": \"println\"}",
            mundo, dificultad
        );
        return callOpenAI(prompt);
    }

    public Map<String, Object> generarPreguntaRelacionarConceptos(String mundo, int dificultad) throws Exception {
        String prompt = String.format(
            "Genera una pregunta de tipo relacionar conceptos para principiantes sobre %s con dificultad %d. " +
            "El formato de salida debe ser JSON estricto. Ejemplo:\n" +
            "{\"pregunta\": \"Relaciona cada concepto con su definición:\", " +
            "\"conceptos\": [\"Clase\", \"Método\", \"Variable\"], " +
            "\"definiciones\": {\"Clase\": \"Define un tipo de objeto.\", \"Método\": \"Contiene instrucciones que se ejecutan.\", \"Variable\": \"Almacena datos.\"}}",
            mundo, dificultad
        );
        return callOpenAI(prompt);
    }

}
