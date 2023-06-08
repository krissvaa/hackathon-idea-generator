package com.example.ideagenerator.service;

import com.example.ideagenerator.data.Keywords;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class KeywordService {
    public List<String> getProductsKeywords() {
        return Keywords.PRODUCTS;
    }

    public List<String> getSubjectsKeywords() {
        return Keywords.SUBJECTS;
    }

    public List<String> getHowsKeywords() {
        return Keywords.HOWS;
    }

    public List<String> getResultKeywords() {
        return Keywords.RESULTS;
    }
}
