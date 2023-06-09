package com.example.ideagenerator.service;

import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class OpenAI {

    @Value("${apikey}")
    private String apiKey;

    public List<String> getHackathonIdeas(String keywords, boolean isFunny) {
        try {

            // OpenAI API key
            // Uses your own API key as OpenAI revokes mine if it sees on GitHub:
            String apiKey = this.apiKey;

            var funny = isFunny ? " weird and funny " : "";

            // Set the prompt
            String prompt = "Provide 3 different " + funny + " ideas for a hackathon projects that must use these keywords:: \n\n";

            List<ChatMessage> messages = new ArrayList<>();
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setRole("system");
            chatMessage.setContent(prompt + keywords);
            messages.add(chatMessage);


            // use the new AI service rather not the client
            OpenAiService service = new OpenAiService(apiKey, Duration.ofSeconds(60));
            ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                    .messages(messages)
                    .model("gpt-3.5-turbo")
                    .build();
            List<ChatCompletionChoice> choices = service.createChatCompletion(completionRequest).getChoices();
            choices.forEach(System.out::println);

            var content = choices.get(0).getMessage().getContent();
            String[] split = content.split("\n\n");
            return Arrays.asList(split);

        } catch (Exception e) {
            System.out.println("Error in get hackathon ideas: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }
}