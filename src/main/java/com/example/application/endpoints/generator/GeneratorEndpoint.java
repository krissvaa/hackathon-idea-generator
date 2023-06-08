package com.example.application.endpoints.generator;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

@Endpoint
@AnonymousAllowed
public class GeneratorEndpoint {

    @Nonnull
    public String generate() {
            return "Hello ";
    }
}