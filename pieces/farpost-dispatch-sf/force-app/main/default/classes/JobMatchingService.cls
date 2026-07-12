/**
 * Ranks eligible Professionals (Contacts) for a Job__c and asks Anthropic,
 * via the Anthropic_API Named Credential, for a short natural-language
 * reason per candidate. The callout originates from Apex — the mirror
 * image of Credential Flow's Python-calls-Salesforce direction.
 */
public with sharing class JobMatchingService {

    public class CandidateRecommendation {
        @AuraEnabled public Id contactId;
        @AuraEnabled public String name;
        @AuraEnabled public Decimal rating;
        @AuraEnabled public String reasoning;
    }

    public class JobMatchingException extends Exception {}

    private static final String NAMED_CREDENTIAL_ENDPOINT = 'callout:Anthropic_API/v1/messages';
    private static final String MODEL = 'claude-haiku-4-5';
    private static final Integer MAX_TOKENS = 600;
    private static final Integer MAX_CANDIDATES = 20;

    @AuraEnabled
    public static List<CandidateRecommendation> getRecommendations(Id jobId) {
        Job__c job = [
            SELECT Id, Job_Type__c, Region__c, Urgency__c, Description__c
            FROM Job__c
            WHERE Id = :jobId
            LIMIT 1
        ];

        List<Contact> candidates = [
            SELECT Id, Name, Rating__c
            FROM Contact
            WHERE Service_Region__c = :job.Region__c
              AND Certifications__c INCLUDES (:job.Job_Type__c)
              AND Availability_Status__c = 'Available'
            ORDER BY Rating__c DESC NULLS LAST
            LIMIT :MAX_CANDIDATES
        ];

        if (candidates.isEmpty()) {
            return new List<CandidateRecommendation>();
        }

        String responseText = callAnthropic(job, candidates);
        return parseRanking(responseText, candidates);
    }

    private static String callAnthropic(Job__c job, List<Contact> candidates) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(NAMED_CREDENTIAL_ENDPOINT);
        req.setMethod('POST');
        req.setHeader('content-type', 'application/json');
        req.setTimeout(20000);
        req.setBody(JSON.serialize(new Map<String, Object>{
            'model' => MODEL,
            'max_tokens' => MAX_TOKENS,
            'messages' => new List<Object>{
                new Map<String, Object>{
                    'role' => 'user',
                    'content' => buildPrompt(job, candidates)
                }
            }
        }));

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() != 200) {
            throw new JobMatchingException(
                'Anthropic API request failed: ' + res.getStatusCode() + ' ' + res.getBody()
            );
        }

        Map<String, Object> body = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
        List<Object> contentBlocks = (List<Object>) body.get('content');
        if (contentBlocks == null || contentBlocks.isEmpty()) {
            throw new JobMatchingException('Anthropic API returned no content');
        }

        String text = '';
        for (Object blockObj : contentBlocks) {
            Map<String, Object> block = (Map<String, Object>) blockObj;
            if (block.get('type') == 'text') {
                text += (String) block.get('text');
            }
        }

        if (String.isBlank(text)) {
            throw new JobMatchingException('Anthropic API returned empty text content');
        }

        return text;
    }

    private static String buildPrompt(Job__c job, List<Contact> candidates) {
        List<String> candidateLines = new List<String>();
        for (Contact c : candidates) {
            candidateLines.add(
                c.Id + ': ' + c.Name + ', rating ' +
                (c.Rating__c == null ? 'unrated' : String.valueOf(c.Rating__c))
            );
        }

        return
            'You are ranking field professionals for a rural service job. ' +
            'Job type: ' + job.Job_Type__c + '. Region: ' + job.Region__c +
            '. Urgency: ' + job.Urgency__c + '. ' +
            'Description: ' + (String.isBlank(job.Description__c) ? 'none provided' : job.Description__c) +
            '. Eligible candidates (already filtered by region, certification, and availability):\n' +
            String.join(candidateLines, '\n') + '\n\n' +
            'Return ONLY a JSON array, ranked best-fit first, of objects shaped exactly like ' +
            '{"contactId": "<id>", "reasoning": "<one short sentence>"} for every candidate listed above. ' +
            'No markdown, no prose outside the JSON array.';
    }

    private static List<CandidateRecommendation> parseRanking(String responseText, List<Contact> candidates) {
        Map<Id, Contact> byId = new Map<Id, Contact>();
        for (Contact c : candidates) {
            byId.put(c.Id, c);
        }

        List<Object> parsed;
        try {
            parsed = (List<Object>) JSON.deserializeUntyped(extractJsonArray(responseText));
        } catch (Exception e) {
            throw new JobMatchingException('Could not parse Anthropic ranking response: ' + e.getMessage());
        }

        List<CandidateRecommendation> results = new List<CandidateRecommendation>();
        Set<Id> seen = new Set<Id>();

        for (Object itemObj : parsed) {
            Map<String, Object> item = (Map<String, Object>) itemObj;
            Id contactId;
            try {
                contactId = (Id) (String) item.get('contactId');
            } catch (Exception e) {
                continue;
            }
            Contact matched = byId.get(contactId);
            if (matched == null || seen.contains(contactId)) {
                continue;
            }
            seen.add(contactId);

            CandidateRecommendation rec = new CandidateRecommendation();
            rec.contactId = matched.Id;
            rec.name = matched.Name;
            rec.rating = matched.Rating__c;
            rec.reasoning = (String) item.get('reasoning');
            results.add(rec);
        }

        // Any eligible candidate the model omitted from its ranking still appears,
        // appended after the model's own ranked set, so no eligible professional
        // is silently dropped from the ops-side/portal view due to a parsing gap.
        for (Contact c : candidates) {
            if (!seen.contains(c.Id)) {
                CandidateRecommendation rec = new CandidateRecommendation();
                rec.contactId = c.Id;
                rec.name = c.Name;
                rec.rating = c.Rating__c;
                rec.reasoning = 'Eligible candidate; not individually ranked by the model.';
                results.add(rec);
            }
        }

        return results;
    }

    private static String extractJsonArray(String text) {
        Integer start = text.indexOf('[');
        Integer stop = text.lastIndexOf(']');
        if (start < 0 || stop < 0 || stop < start) {
            throw new JobMatchingException('Anthropic response did not contain a JSON array');
        }
        return text.substring(start, stop + 1);
    }
}
