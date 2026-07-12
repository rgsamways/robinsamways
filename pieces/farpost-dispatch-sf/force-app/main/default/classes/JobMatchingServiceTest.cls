@isTest
private class JobMatchingServiceTest {

    private class AnthropicRankingMock implements HttpCalloutMock {
        public Integer callCount = 0;
        private String responseBody;

        public AnthropicRankingMock(String responseBody) {
            this.responseBody = responseBody;
        }

        public HttpResponse respond(HttpRequest req) {
            callCount++;
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody(responseBody);
            return res;
        }
    }

    private static Job__c createJob(String region, String jobType) {
        Job__c job = new Job__c(
            Region__c = region,
            Job_Type__c = jobType,
            Urgency__c = 'Medium',
            Description__c = 'Test job description'
        );
        insert job;
        return job;
    }

    private static Contact createProfessional(
        String lastName, String region, String certifications, String availability, Decimal rating
    ) {
        Contact c = new Contact(
            LastName = lastName,
            Service_Region__c = region,
            Certifications__c = certifications,
            Availability_Status__c = availability,
            Rating__c = rating
        );
        insert c;
        return c;
    }

    @isTest
    static void testEligibleCandidatesAreFilteredAndRanked() {
        Job__c job = createJob('Bancroft', 'Electrical');

        Contact eligible1 = createProfessional(
            'Eligible One', 'Bancroft', 'Electrical;General Inspection', 'Available', 4.5
        );
        Contact eligible2 = createProfessional(
            'Eligible Two', 'Bancroft', 'Electrical', 'Available', 3.9
        );
        createProfessional('Wrong Region', 'Faraday', 'Electrical', 'Available', 5.0);
        createProfessional('Wrong Cert', 'Bancroft', 'Roofing', 'Available', 5.0);
        createProfessional('Unavailable', 'Bancroft', 'Electrical', 'Unavailable', 5.0);

        String mockResponse = JSON.serialize(new Map<String, Object>{
            'content' => new List<Object>{
                new Map<String, Object>{
                    'type' => 'text',
                    'text' => JSON.serialize(new List<Object>{
                        new Map<String, Object>{
                            'contactId' => eligible1.Id,
                            'reasoning' => 'Highest rated match in region.'
                        },
                        new Map<String, Object>{
                            'contactId' => eligible2.Id,
                            'reasoning' => 'Also certified and available.'
                        }
                    })
                }
            }
        });

        Test.setMock(HttpCalloutMock.class, new AnthropicRankingMock(mockResponse));

        Test.startTest();
        List<JobMatchingService.CandidateRecommendation> results =
            JobMatchingService.getRecommendations(job.Id);
        Test.stopTest();

        System.assertEquals(2, results.size(), 'Only the two eligible candidates should be returned');
        System.assertEquals(eligible1.Id, results[0].contactId, 'Highest-ranked candidate should be first');
        System.assertEquals('Highest rated match in region.', results[0].reasoning);
        System.assertEquals(eligible2.Id, results[1].contactId);
    }

    @isTest
    static void testNoEligibleCandidatesReturnsEmptyWithoutCallout() {
        Job__c job = createJob('Wollaston', 'Roofing');
        createProfessional('Wrong Region', 'Bancroft', 'Roofing', 'Available', 5.0);

        AnthropicRankingMock mock = new AnthropicRankingMock('{}');
        Test.setMock(HttpCalloutMock.class, mock);

        Test.startTest();
        List<JobMatchingService.CandidateRecommendation> results =
            JobMatchingService.getRecommendations(job.Id);
        Test.stopTest();

        System.assertEquals(0, results.size(), 'No eligible candidates should return an empty list');
        System.assertEquals(0, mock.callCount, 'Anthropic should never be called when there are no eligible candidates');
    }

    @isTest
    static void testUnrankedEligibleCandidateStillAppearsInResults() {
        Job__c job = createJob('Limerick', 'Septic/Well');
        Contact ranked = createProfessional('Ranked Pro', 'Limerick', 'Septic/Well', 'Available', 4.0);
        Contact omitted = createProfessional('Omitted Pro', 'Limerick', 'Septic/Well', 'Available', 3.0);

        String mockResponse = JSON.serialize(new Map<String, Object>{
            'content' => new List<Object>{
                new Map<String, Object>{
                    'type' => 'text',
                    'text' => JSON.serialize(new List<Object>{
                        new Map<String, Object>{ 'contactId' => ranked.Id, 'reasoning' => 'Good fit.' }
                    })
                }
            }
        });

        Test.setMock(HttpCalloutMock.class, new AnthropicRankingMock(mockResponse));

        Test.startTest();
        List<JobMatchingService.CandidateRecommendation> results =
            JobMatchingService.getRecommendations(job.Id);
        Test.stopTest();

        System.assertEquals(
            2, results.size(), 'Both eligible candidates should appear even though only one was ranked by name'
        );
        System.assertEquals(ranked.Id, results[0].contactId);
        System.assertEquals(
            omitted.Id, results[1].contactId, 'Omitted-but-eligible candidate should still be appended'
        );
    }
}
