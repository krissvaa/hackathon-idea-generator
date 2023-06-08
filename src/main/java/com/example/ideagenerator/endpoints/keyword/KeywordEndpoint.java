package com.example.ideagenerator.endpoints.keyword;

import com.example.ideagenerator.service.KeywordService;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class KeywordEndpoint {

    private final KeywordService keywordService;

    @Autowired
    public KeywordEndpoint(KeywordService keywordService) {
        this.keywordService = keywordService;
    }

    @Nonnull
    public List<@Nonnull String> getProductsKeywords() {
        return keywordService.getProductsKeywords();
    }

    @Nonnull
    public List<@Nonnull String> getSubjectsKeywords() {
        return keywordService.getSubjectsKeywords();
    }

    @Nonnull
    public List<@Nonnull String> getHowsKeywords() {
        return keywordService.getHowsKeywords();
    }

    @Nonnull
    public List<@Nonnull String> getResultKeywords() {
        return keywordService.getResultKeywords();
    }
}
