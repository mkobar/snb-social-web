angular.module('starter.controllers-invite', [])

// not working yet
/**
 * Invire - invite friends via email
 */
.controller('InviteCtrl', function($scope, $ionicModal) {
  
  // Form data for the invite modal
  $scope.inviteData = {};

  $ionicModal.fromTemplateUrl('templates/timeline/invite-modal.html', {
    scope = $scope
  }).then(function (modal) {
    $scope.modalInvite = modal;
    animation: 'slide-in-up'
  });
  $scope.closeInvite = function() {
	  $scope.modalInvite.hide();
  };
  $scope.openInvite = function() {
	  $scope.modalInvite.show();
  };

})

