@isTest
private class OpenJobsControllerTest {

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
    static void testReturnsOnlyMatchingOpenJobsForContact() {
        Contact me = createProfessional('Board Viewer', 'Bancroft', 'Electrical', 'Available', 4.0);

        Job__c matching = new Job__c(
            Region__c = 'Bancroft', Job_Type__c = 'Electrical',
            Urgency__c = 'Medium', Status__c = 'Open', Description__c = 'Matches me'
        );
        Job__c wrongRegion = new Job__c(
            Region__c = 'Faraday', Job_Type__c = 'Electrical',
            Urgency__c = 'Medium', Status__c = 'Open', Description__c = 'Wrong region'
        );
        Job__c wrongType = new Job__c(
            Region__c = 'Bancroft', Job_Type__c = 'Roofing',
            Urgency__c = 'Medium', Status__c = 'Open', Description__c = 'Wrong type'
        );
        Job__c alreadyClaimed = new Job__c(
            Region__c = 'Bancroft', Job_Type__c = 'Electrical',
            Urgency__c = 'Medium', Status__c = 'Claimed', Description__c = 'Already claimed'
        );
        insert new List<Job__c>{ matching, wrongRegion, wrongType, alreadyClaimed };

        Test.startTest();
        List<OpenJobsController.JobBoardItem> results = OpenJobsController.getOpenJobsForContact(me.Id);
        Test.stopTest();

        System.assertEquals(1, results.size(), 'Only the region+type+status matching job should be returned');
        System.assertEquals(matching.Id, results[0].jobId);
    }

    @isTest
    static void testAiRecommendedFlagsOnlyTheTopRatedEligibleCandidate() {
        Contact higherRated = createProfessional('Higher Rated', 'Wollaston', 'Roofing', 'Available', 4.8);
        Contact lowerRated = createProfessional('Lower Rated', 'Wollaston', 'Roofing', 'Available', 3.2);

        Job__c job = new Job__c(
            Region__c = 'Wollaston', Job_Type__c = 'Roofing',
            Urgency__c = 'High', Status__c = 'Open', Description__c = 'Roof job'
        );
        insert job;

        Test.startTest();
        List<OpenJobsController.JobBoardItem> forHigherRated =
            OpenJobsController.getOpenJobsForContact(higherRated.Id);
        List<OpenJobsController.JobBoardItem> forLowerRated =
            OpenJobsController.getOpenJobsForContact(lowerRated.Id);
        Test.stopTest();

        System.assertEquals(
            true, forHigherRated[0].aiRecommended, 'Highest-rated eligible candidate should be flagged recommended'
        );
        System.assertEquals(
            false, forLowerRated[0].aiRecommended, 'Lower-rated eligible candidate should not be flagged recommended'
        );
    }

    @isTest
    static void testNoMatchingJobsReturnsEmptyList() {
        Contact me = createProfessional('No Match Pro', 'Limerick', 'General Inspection', 'Available', 4.0);

        Test.startTest();
        List<OpenJobsController.JobBoardItem> results = OpenJobsController.getOpenJobsForContact(me.Id);
        Test.stopTest();

        System.assertEquals(0, results.size(), 'A professional with no matching open jobs should see an empty board');
    }
}
