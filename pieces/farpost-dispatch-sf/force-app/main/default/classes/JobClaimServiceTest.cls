@isTest
private class JobClaimServiceTest {

    @isTest
    static void testSuccessfulClaim() {
        Job__c job = new Job__c(
            Region__c = 'Bancroft',
            Job_Type__c = 'Electrical',
            Urgency__c = 'High',
            Status__c = 'Open',
            Description__c = 'Test job'
        );
        insert job;

        Contact professional = new Contact(
            LastName = 'Test Professional',
            Service_Region__c = 'Bancroft',
            Certifications__c = 'Electrical',
            Availability_Status__c = 'Available',
            Rating__c = 4.0
        );
        insert professional;

        Test.startTest();
        JobClaimService.ClaimResult result = JobClaimService.claimJob(job.Id, professional.Id);
        Test.stopTest();

        System.assertEquals(true, result.success, 'Claiming an open job should succeed');

        Job__c updated = [SELECT Status__c, Assigned_Professional__c FROM Job__c WHERE Id = :job.Id];
        System.assertEquals('Claimed', updated.Status__c);
        System.assertEquals(professional.Id, updated.Assigned_Professional__c);
    }

    @isTest
    static void testSecondClaimOnAlreadyClaimedJobIsRejected() {
        Contact firstProfessional = new Contact(
            LastName = 'First Professional',
            Service_Region__c = 'Faraday',
            Certifications__c = 'Roofing',
            Availability_Status__c = 'Available',
            Rating__c = 4.5
        );
        insert firstProfessional;

        Contact secondProfessional = new Contact(
            LastName = 'Second Professional',
            Service_Region__c = 'Faraday',
            Certifications__c = 'Roofing',
            Availability_Status__c = 'Available',
            Rating__c = 3.8
        );
        insert secondProfessional;

        Job__c job = new Job__c(
            Region__c = 'Faraday',
            Job_Type__c = 'Roofing',
            Urgency__c = 'Low',
            Status__c = 'Open',
            Description__c = 'Test job'
        );
        insert job;

        JobClaimService.ClaimResult firstResult = JobClaimService.claimJob(job.Id, firstProfessional.Id);
        System.assertEquals(true, firstResult.success);

        Test.startTest();
        JobClaimService.ClaimResult secondResult = JobClaimService.claimJob(job.Id, secondProfessional.Id);
        Test.stopTest();

        System.assertEquals(
            false, secondResult.success, 'A second claim on an already-claimed job should be rejected'
        );

        Job__c updated = [SELECT Status__c, Assigned_Professional__c FROM Job__c WHERE Id = :job.Id];
        System.assertEquals('Claimed', updated.Status__c);
        System.assertEquals(
            firstProfessional.Id, updated.Assigned_Professional__c, 'The original claimant should remain assigned'
        );
    }
}
