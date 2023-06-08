package com.example.ideagenerator.service;

import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

public class OpenAI {

    public static void main(String[] args) {
        System.out.println(getHackathonIdeas("[{modern, java, mobile, time-machine}]"));
    }

    public static String getHackathonIdeas(String keywords) {
        try {

            // OpenAI API key
            // Uses your own API key as OpenAI revokes mine if it sees on GitHub:
            String apiKey = "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";

            // Set the prompt
            String prompt = "Provide 3 different ideas for a hackathon that use these keywords:: \n\n";

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

            return choices.get(0).getMessage().getContent();

        } catch (Exception e) {
            System.out.println("Error in get hackathon ideas: " + e.getMessage());
            e.printStackTrace();
            return "";
        }
    }
}