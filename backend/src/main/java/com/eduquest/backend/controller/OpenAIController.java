package com.eduquest.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.eduquest.backend.service.OpenAIService;

import java.util.Map;

@RestController
@RequestMapping("/api/openai")
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;

    @GetMapping("/preguntaVerdadero")
    public Map<String, Object> obtenerPreguntaVerdadero(@RequestParam String mundo, @RequestParam int dificultad) throws Exception {
        return openAIService.generarPreguntaVerdadero(mundo, dificultad);
    }

    @GetMapping("/preguntaDefinicion")
    public Map<String, Object> obtenerPreguntaDefinicion(@RequestParam String mundo, @RequestParam int dificultad) throws Exception {
        return openAIService.generarPreguntaDefinicion(mundo, dificultad);
    }

    @GetMapping("/preguntaOpcionMultiple")
    public Map<String, Object> obtenerPreguntaOpcionMultiple(@RequestParam String mundo, @RequestParam int dificultad) throws Exception {
        return openAIService.generarPreguntaOpcionMultiple(mundo, dificultad);
    }

    @GetMapping("/preguntaCompletarCodigo")
    public Map<String, Object> obtenerPreguntaCompletarCodigo(@RequestParam String mundo, @RequestParam int dificultad) throws Exception {
        return openAIService.generarPreguntaCompletarCodigo(mundo, dificultad);
    }

    @GetMapping("/preguntaRelacionarConceptos")
    public Map<String, Object> obtenerPreguntaRelacionarConceptos(@RequestParam String mundo, @RequestParam int dificultad) throws Exception {
        return openAIService.generarPreguntaRelacionarConceptos(mundo, dificultad);
    }

}
