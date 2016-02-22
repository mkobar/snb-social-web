angular.module('starter.controllers-submit', [])

/**
 * Submit
 */
.controller('SubmitCtrl', function($scope, $state, 
    $ionicActionSheet, $ionicSlideBoxDelegate, $ionicHistory, 
    Profile, Auth, Codes, Utils, CordovaCamera, Timeline) {
  
  $scope.$on('$ionicView.enter', function(e) {
    initData();
    loadProfileData();
  });
  
  // Form
  // ---------------
  function initData() {
    $scope.FormData = {
        meta: {
            text: "",
            location: "",
            tag: "",
	    button: "",
// comments
// ratings?
        },
        uid: Auth.AuthData.uid,
        timestamp_create: Firebase.ServerValue.TIMESTAMP
    };
    $scope.FormImages = [];
    $scope.AuthData = Auth.AuthData;
  };
  
  // Profile data
  // ---------------
  function loadProfileData(){
    // check if in cache
    if(Profile.ProfileData.hasOwnProperty('meta')){
        $scope.ProfileData = Profile.ProfileData;
    } else {
        // otherwise load (note: AuthData.uid is resolved)
        Profile.get(Auth.AuthData.uid).then(
            function(ProfileData){
                console.log(ProfileData);
                $scope.ProfileData = ProfileData;
            },
            function(error){
                console.log(error);
                $scope.ProfileData = {};
                Utils.showMessage('Oops... profile data not loaded', 1500)
            }
        );
    };
  };
  
  // Add GPS location
  // ---------------
  // next!


  $scope.addImage = function() {
    // Show the action sheet
    var hideSheetImage = $ionicActionSheet.show({
        buttons: [
            { text: 'Take a new picture' },
            { text: 'Import from phone library' },
        ],
        titleText: 'Add an image to your post',
        cancelText: 'Cancel',
        cancel: function() {
            // add cancel code..
	    //hideSheetImage();
        },
        buttonClicked: function(sourceTypeIndex) {
            //hideSheetImage();
            proceed(sourceTypeIndex)
            return true;
        }
    });
    function proceed(sourceTypeIndex) {
      CordovaCamera.newImage(sourceTypeIndex, 800).then(
        function(ImageData){
            if(ImageData != null) {
                $scope.FormImages.push(ImageData);
                $ionicSlideBoxDelegate.update();
            }
        }
      );
    };
  };
  
  $scope.removeImage = function(index) {
    $scope.FormImages.splice(index, 1);
    $ionicSlideBoxDelegate.slide(0);
    $ionicSlideBoxDelegate.update();
  };
  
  $scope.slideHasChanged = function () {
    $ionicSlideBoxDelegate.update();
  };
  
  // Submit
  // ----------------
  $scope.submitPost = function() {
	  // tried ionicModal - but it never poped up!!
	  // tried actionSheet, but it only works on some mobile, some of the time (because it is the second actionSheet?)
	  /**
    // Show the action sheet
    var hideSheetPost = $ionicActionSheet.show({
        backdrop: 'static',
	keyboard: false,
        buttons: [
            { text: 'Post (Public to Building)' },
            { text: 'Announcement' },
            { text: 'Event' },
            { text: 'Lost & Found' },
            { text: 'Facility Issue' },
        ],
        titleText: 'Send how?',
        cancelText: 'Cancel',
        cancel: function() {
            // add cancel code..
	    //hideSheetPost();
        },
        buttonClicked: function(index) {
            typeOfPost(index)
	    //hideSheetPost();
            return true;
        }
    });
    
    function typeOfPost(index) {
       // set a flag to add to post
       if (index == 1) {
	       $scope.tag = "announce";
       } else if (index ==2) {
	       $scope.tag = "event";
       } else if (index == 3) {
	       $scope.tag = "lostfound";
       } else if (index == 4) {
	       $scope.tag = "issue";
       }
       //$ionicSlideBoxDelegate.update();
    };

    **/
    if($scope.returnCount()>=0){
	    // TODO none of this works yet and I have 30 minutes to wrap it up!
            //$scope.FormData.meta.button = "button-light";
	    $scope.FormData.meta.button = "button-energized";
	    if ($scope.FormData.meta.tab == "facility issue") {
		    $scope.FormData.meta.button = 'button-assertive';
	    }
	    else {
		    if ($scope.FormData.meta.tab == "event") {
		        $scope.FormData.meta.button = "button-balanced";
	    	    }
	            else {
			    if ($scope.FormData.meta.tab == "announce") {
		               $scope.FormData.meta.button = "button-energized";
	                    }
	                    else {
				    if ($scope.FormData.meta.tab == "lost & found") {
		                       $scope.FormData.meta.button = "button-positive";
				    }
			    }
		    }
	    }
      Timeline.addPost($scope.AuthData.uid, $scope.FormData, $scope.FormImages).then(
        function(success){
          $state.go('tab.timeline');
          initData();
        })
    } else {
      Codes.handleError({code: "POST_NEW_CHAR_EXCEEDED"})
    }
  };
  
  // Add location
  // ---------------
  $scope.addLocation = function() {
    // coming up
  };
  
  
  // Other
  // ---------------
  
  $scope.close = function() {
    $state.go('tab.timeline');
  };
  
  $scope.returnCount = function() {
    if($scope.FormData){
      return POST_MAX_CHAR - $scope.FormData.meta.text.length;
    }
  };
  
})

