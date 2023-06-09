package com.example.ideagenerator.endpoints.generator;

import com.example.ideagenerator.service.KeywordService;
import com.example.ideagenerator.service.OpenAI;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class GeneratorEndpoint {


    private OpenAI openAI;
    private final KeywordService keywordService;

    @Autowired
    public GeneratorEndpoint(OpenAI openAI, KeywordService keywordService) {
        this.openAI = openAI;
        this.keywordService = keywordService;
    }

    @Nonnull
    public List<@Nonnull String> getIdeas(@Nonnull List<@Nonnull String> tokens, boolean extraFunny) {
        System.out.println("Tokens: " + tokens.toString() + ", is extra Funny: " + extraFunny);
        keywordService.validateKeywords(tokens);
        return openAI.getHackathonIdeas(tokens.toString(), extraFunny);
    }
}