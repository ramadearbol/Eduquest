package com.eduquest.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.eduquest.backend.security.OpenAIService;

@RestController
@RequestMapping("/api/openai")
@CrossOrigin(origins = "http://localhost:5173") // o Vercel domain en prod
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;

    @GetMapping("/preguntaVerdadero")
    public String obtenerPreguntaVerdadero(@RequestParam String mundo, @RequestParam int dificultad) {
        return openAIService.generarPreguntaVerdadero(mundo, dificultad);
    }

    @GetMapping("/preguntaDefinicion")
    public String obtenerPreguntaDefinicion(@RequestParam String mundo, @RequestParam int dificultad) {
        return openAIService.generarPreguntaDefinicion(mundo, dificultad);
    }

    @GetMapping("/preguntaOpcionMultiple")
    public String obtenerPreguntaOpcionMultiple(@RequestParam String mundo, @RequestParam int dificultad) {
        return openAIService.generarPreguntaOpcionMultiple(mundo, dificultad);
    }

    @GetMapping("/preguntaCompletarCodigo")
    public String obtenerPreguntaCompletarCodigo(@RequestParam String mundo, @RequestParam int dificultad) {
        return openAIService.generarPreguntaCompletarCodigo(mundo, dificultad);
    }

    @GetMapping("/preguntaRelacionarConceptos")
    public String obtenerPreguntaRelacionarConceptos(@RequestParam String mundo, @RequestParam int dificultad) {
        return openAIService.generarPreguntaRelacionarConceptos(mundo, dificultad);
    }

}
