package com.chaku.ai.controller;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.api.OllamaChatOptions;
import org.springframework.ai.ollama.api.OllamaModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    private final ChatModel chatModel;

    public TestController(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping
    public String test(@RequestParam String query) {
        return chatModel.call(
            new Prompt(
                query,
                OllamaChatOptions.builder()
                    .model(OllamaModel.LLAMA3_2_3B)
                    .temperature(0.4)
                    .build()
            )).getResult().getOutput().getText();
    }
}
