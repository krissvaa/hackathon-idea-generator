package com.example.ideagenerator.endpoints.generator;

import com.example.ideagenerator.service.OpenAI;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class GeneratorEndpoint {

    @Autowired
    public GeneratorEndpoint() {

    }

    @Nonnull
    public List<@Nonnull String> getIdeas(@Nonnull List<@Nonnull String> tokens) {
        System.out.println("Tokens: " + tokens.toString());
        return OpenAI.getHackathonIdeas(tokens.toString());
    }
}