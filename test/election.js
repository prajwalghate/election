const Election = artifacts.require("./Election.sol")


 contract('Election', (accounts) =>{
 	let election
 	before(async ()=>{
 		election = await Election.new()
 	})
 	

 	describe('Election deployment', async () => {
    it('no. of candidates', async () => {
      const can = await election.candidatesCount()
      assert.equal(can, 2)
    })
  })

 	it("it initializes the candidates with the correct values", async ()=>{
 		var can1 = await election.candidates(1);
 		var can2= await election.candidates(2);

 		assert.equal(can1[0], 1, "contains the correct id");
      	assert.equal(can1[1], "Candidate 1", "contains the correct name");
      	assert.equal(can1[2], 0, "contains the correct votes count");
      	assert.equal(can2[0], 2, "contains the correct id");
      	assert.equal(can2[1], "Candidate 2", "contains the correct name");
      	assert.equal(can2[2], 0, "contains the correct votes count");

 	})


 	/*it("allows a voter to cast a vote", async ()=>{
 		var can1 = await election.candidates(1);
 		receipt = await election.vote(1,{from: accounts[0]})
 		voted=election.voters(accounts[0]);
 		assert.equal(receipt.logs.length, 1, "an event was triggered");
     	assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
     	assert.equal(receipt.logs[0].args._candidateId.toNumber(), 1, "the candidate id is correct");
		assert(voted, "the voter was marked as voted");
     	assert.equal(can1[2], 1, "increments the candidate's vote count");

 	}) 
     */

      it("allows a voter to cast a vote", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    }).then(function(receipt) {
      /*assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");*/
      return electionInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "the voter was marked as voted");
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });


   	it("throws an exception for invalid candiates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
    });
  });

  it("throws an exception for double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
    });
  });


 })