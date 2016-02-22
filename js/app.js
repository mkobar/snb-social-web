/**
 * SNB ver 0.0.1
 *
 * uses versions: 
 *  ionic:        1.2.4
 *  firebase:     2.4.0
 *  angularfire:  1.1.3
 * 
 * To edit the SASS, use gulp:
 * npm install -g gulp
 * 
 * Also install the following ngCordova plugins:
 *  cordova plugin add cordova-plugin-inappbrowser
 *  cordova plugin add ionic-plugin-keyboard
 */

var FBURL                 = "<YOUR-FB-URL>";
var POST_MAX_CHAR         = 150;

angular.module('starter', [
  'ionic', 
  'ngCordova',
  'firebase',
  
  // timeline and followers
  'starter.controllers-timeline',
  'starter.controllers-submit',
  //'starter.controllers-invite',
  'starter.controllers-followers',
  'starter.services-followers',
  'starter.services-timeline',
  
  // auth and profile
  'starter.controllers-account',
  'starter.services-auth',
  'starter.services-profile',
  
  // cordova
  'starter.services-cordova-camera',
  
  // helpers
  'starter.services-codes',
  'starter.services-utils',
  'starter.services-fb-functions',
  'starter.directives'
  ]
)

.run(function($ionicPlatform, $rootScope, $ionicHistory, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar
    // above the keyboad for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
  // Redirect the user to the login state if unAuthenticated
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.log("$stateChangeError", error);
    event.preventDefault(); // http://goo.gl/se4vxu
    if(error == "AUTH_LOGGED_OUT") {
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go('tab.account');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  
  // Define the resolve function, which checks whether the user is Authenticated
  // It fires $stateChangeError if not the case
  var authResolve = function (Auth) {
    return Auth.getAuthState();
  };
  
  // https://github.com/angular-ui/ui-router
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  
  // view timeline
  .state('tab.timeline', {
    url: '/timeline/:uid',
    views: {
      'tab-timeline': {
        templateUrl: 'templates/timeline/tab-timeline.html',
        controller: 'TimelineCtrl',
        resolve: {authResolve: authResolve}
      }
    }
  })
  
  // manage followers
  .state('tab.followers', {
    url: '/followers',
    views: {
      'tab-followers': {
        templateUrl: 'templates/timeline/tab-followers.html',
        controller: 'FollowersCtrl',
        resolve: {authResolve: authResolve}
      }
    }
  })
  
  /*
  // invite friends
  .state('invite', {
    url: '/invite',
    //controller: 'InviteCtrl',
    templateUrl: 'templates/timeline/invite-modal.html',
    resolve: {authResolve: authResolve}
  })
  */
  
  // new post
  .state('submit', {
    url: '/submit',
    controller: 'SubmitCtrl',
    templateUrl: 'templates/timeline/submit.html',
    resolve: {authResolve: authResolve}
  })
  
  // account settings, signup and login
  .state('tab.account', {
    url: '/account/:nextState',
    views: {
      'tab-account': {
        templateUrl: 'templates/auth/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/timeline/');

})
