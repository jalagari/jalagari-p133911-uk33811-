package com.form.seds.core.models;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;

import static org.apache.sling.api.resource.ResourceResolver.PROPERTY_RESOURCE_TYPE;

@Model(adaptables = Resource.class)
public class ConversationalForm {

    @ValueMapValue(name=PROPERTY_RESOURCE_TYPE, injectionStrategy= InjectionStrategy.OPTIONAL)
    @Default(values="No resourceType")
    protected String resourceType;

    @ValueMapValue(injectionStrategy= InjectionStrategy.OPTIONAL)
    protected String chatbotTitle;

    @ValueMapValue(injectionStrategy= InjectionStrategy.OPTIONAL)
    protected String conversationEndpoint;

    @ValueMapValue(injectionStrategy= InjectionStrategy.OPTIONAL)
    protected String[] initialMessages;

    @ValueMapValue(injectionStrategy= InjectionStrategy.OPTIONAL)
    protected String mode;

    @ValueMapValue(injectionStrategy= InjectionStrategy.OPTIONAL)
    protected String genaiEndpoint;

    @SlingObject
    private Resource currentResource;
    @SlingObject
    private ResourceResolver resourceResolver;

    private String message;

    @PostConstruct
    protected void init() {

    }

    public String getChatbotTitle() {
        return chatbotTitle;
    }

    public String getInitialMessages() {
        if(initialMessages != null && initialMessages.length > 0) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                return objectMapper.writeValueAsString(initialMessages);
            } catch (Exception e) {
                return "[]";
            }
        }
        return "[]";
    }

    public String getConversationEndpoint() {
        return conversationEndpoint;
    }

    public String getGenaiEndpoint() {
        return genaiEndpoint;
    }

    public String getMode() {
        return mode;
    }
}
