angular.module('starter.controllers-followers', [])

.controller('FollowersCtrl', function(
    //$rootScope, $scope, $ionicModal,
    $scope, $ionicPopup,
    Auth, Codes, Utils, Profile, Followers) {
    
    $scope.tempData = {noProfilePicture: "img/ionic.png"};
    $scope.loadingMode = true;
    $scope.searchUser = {value: ""};
    
    $scope.FollowingList        = Followers.FollowingList;
    $scope.FollowingProfiles    = Followers.FollowingProfiles;
    doRefresh();
    
    $scope.$on('$rootScope.refresh', function(){ // called when logged out for instance
        Followers.resetFollowing();
        $scope.doRefresh();
    });
    
    $scope.doRefresh = function() {
        doRefresh();
    };
    
    function doRefresh() {
        
        $scope.AuthData             = Auth.AuthData;
        
        if($scope.AuthData.hasOwnProperty('uid')) {
            Followers.refreshFollowing($scope.AuthData.uid).then(
                function(success){
                    refreshComplete();
                }, function(error){
                    refreshComplete();
                    handleError(error)
                }
            )
        } else {
            refreshComplete();
        };
        
        
    };
    
    //
    function refreshComplete() {
        $scope.FollowingList        = Followers.FollowingList;
        $scope.FollowingProfiles    = Followers.FollowingProfiles;
        
        $scope.searchUser = {value: ""};
        $scope.loadingMode = false;
        $scope.$broadcast('scroll.refreshComplete');
    };
    
    
    // -------------------------------------------------------------------------
    // Add / Delete
    // -------------------------------------------------------------------------
  
    $scope.addFollower = function() {
        if($scope.searchUser.value) {
            Utils.showMessage("Searching for user...");
            
            Followers.addFollower($scope.AuthData.uid, $scope.searchUser.value, true).then(
                function(success){
                    Utils.showMessage("Adding user...", 1000);
                    doRefresh();
                }, function(error){
                    handleError(error)
                }
            )
            
        }
    };
    
    $scope.stopFollowing = function(fid) {
        console.log("stopFollowing", fid)
        if(fid) {
            Followers.stopFollowing($scope.AuthData.uid, fid).then(
                function(success){
                    doRefresh();
                }, function(error){
                    handleError(error)
                }
            )
        }
    };
  
// does not work - will not pop! 
/*
    // ----------------------------------------------------------------
    // MODAL: Invite 
    // ----------------------------------------------------------------

    // Form data for the invite modal
    $scope.inviteData = {};

    $ionicModal.fromTemplateUrl('templates/timeline/invite-modal.html', {
      scope = $scope
    }).then(function (modal) {
       $scope.modalInvite = modal;
       //animation: 'slide-in-up'
    });
    $scope.closeInvite = function() {
	  $scope.modalInvite.hide();
    };
    $scope.openInvite = function() {
	  $scope.modal.hide();
	  $scope.modalInvite.show();
    };
    $scope.doInviteFriends = function() {
	    console.log('inviteFriends',$scope.inviteData);
	    if ($scope.inviteData.email && $scope.inviteData.message) {
		Utils.showMessage("Sending Invite")
		// send data here
		$scope.closeInvite();
		Utils.showMessage("Invite sent!", 500)
	    } else {
		Codes.handleError({code: "INVALID_INPUT"})
	    }
    };
*/
 
    // -------------------------------------------------------------------------
    // Other (can be put in service)
    // -------------------------------------------------------------------------
  
  
    /**
    * Translates error codes to the language of commoners
    * Todo: put in service for consistency
    */
    function handleError(error) { 
        Codes.handleError(error);
    };
})
