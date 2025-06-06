package com.eduquest.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class OpenAIService {

    // Clave API para autenticarse con OpenAI (configurada en application.properties)
    @Value("${openai.api.key}")
    private String apiKey;

    // URL base de la API de OpenAI
    @Value("${openai.api.url}")
    private String apiUrl;

    // Modelo de OpenAI a utilizar (por ejemplo, "gpt-4")
    @Value("${openai.model}")
    private String model;

    // Cliente HTTP para hacer peticiones REST
    private final RestTemplate restTemplate = new RestTemplate();

    // Mapper para convertir JSON en objetos Java y viceversa
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Método privado para llamar a la API de OpenAI con un prompt específico.
     * Envía un mensaje al modelo y recibe la respuesta en formato JSON.
     * 
     * @param prompt Texto que describe la solicitud para la IA
     * @return Mapa con la respuesta parseada en formato JSON
     * @throws Exception si hay error en la llamada o en el parseo
     */
    private Map<String, Object> callOpenAI(String prompt) throws Exception {
        // Construir cuerpo de la petición JSON
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        // Mensajes enviados al modelo (con rol de "user")
        requestBody.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        requestBody.put("temperature", 0.7); // Controla creatividad de la respuesta

        // Encabezados HTTP para la llamada (content-type y autenticación)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // Crear la entidad HTTP con cuerpo y headers
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // Ejecutar POST a la API de OpenAI
        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        // Validar que la respuesta fue exitosa y no es nula
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Error al llamar a OpenAI: " + response.getStatusCode());
        }

        // Extraer la lista de "choices" devueltos por el modelo
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String content = message.get("content").toString();

        // Limpiar la respuesta para quitar bloques de código y comillas extras
        content = cleanOpenAIResponse(content);

        // Parsear el JSON limpio a un Map
        return objectMapper.readValue(content, Map.class);
    }

    /**
     * Limpia el contenido de la respuesta para eliminar bloques markdown y comillas extras.
     * Esto facilita el parseo posterior a JSON.
     * 
     * @param content Texto bruto devuelto por OpenAI
     * @return Texto limpio listo para parseo JSON
     */
    private String cleanOpenAIResponse(String content) {
        content = content.trim();

        // Si empieza con bloque markdown ```json o similar, eliminar líneas de apertura y cierre
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

        // Eliminar comillas dobles o simples al inicio y final si están presentes
        if ((content.startsWith("\"") && content.endsWith("\"")) ||
            (content.startsWith("'") && content.endsWith("'"))) {
            content = content.substring(1, content.length() - 1).trim();
        }

        return content;
    }

    /**
     * Genera una pregunta tipo verdadero o falso para un tema y dificultad dados.
     * 
     * @param mundo Tema o ámbito para la pregunta (ej. "Java")
     * @param dificultad Nivel de dificultad
     * @return Mapa con la pregunta y respuesta en formato JSON
     * @throws Exception Si falla la llamada o el parseo
     */
    public Map<String, Object> generarPreguntaVerdadero(String mundo, int dificultad) throws Exception {
        String prompt = String.format(
            "Genera una pregunta tipo verdadero o falso sobre %s con dificultad %d. " +
            "Responde SOLO con un JSON válido y sin texto adicional. Formato:\n" +
            "{\"pregunta\": \"¿Una clase en Java puede tener múltiples constructores?\", \"respuesta_correcta\": \"verdadero\"}",
            mundo, dificultad
        );
        return callOpenAI(prompt);
    }

    /**
     * Genera una pregunta tipo definición para estudiantes principiantes.
     */
    public Map<String, Object> generarPreguntaDefinicion(String mundo, int dificultad) throws Exception {
        String prompt = String.format(
            "Genera una pregunta de tipo definición para estudiantes principiantes sobre %s con dificultad %d. " +
            "El formato de salida debe ser estrictamente JSON, sin texto adicional. Ejemplo:\n" +
            "{\"pregunta\": \"¿Qué es una variable en Java?\", \"opciones\": [\"Un tipo de dato\", \"Una función\", \"Una ubicación en memoria\", \"Un paquete\"], \"respuesta_correcta\": \"Una ubicación en memoria\"}",
            mundo, dificultad
        );
        return callOpenAI(prompt);
    }

    /**
     * Genera una pregunta de opción múltiple con 4 opciones y una respuesta correcta.
     */
    public Map<String, Object> generarPreguntaOpcionMultiple(String mundo, int dificultad) throws Exception {
        String prompt = String.format(
            "Genera una pregunta de opción múltiple sobre %s con dificultad %d para estudiantes principiantes. " +
            "Debe tener 4 opciones y una única respuesta correcta. El formato debe ser JSON estricto, sin texto adicional. Ejemplo:\n" +
            "{\"pregunta\": \"¿Cuál de estos es un tipo de dato primitivo en Java?\", \"opciones\": [\"int\", \"String\", \"float\", \"boolean\"], \"respuesta_correcta\": \"int\"}",
            mundo, dificultad
        );
        return callOpenAI(prompt);
    }

    /**
     * Genera una pregunta para completar un fragmento de código en Java.
     */
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

    /**
     * Genera una pregunta para relacionar conceptos con sus definiciones.
     */
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
